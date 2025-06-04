import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { z } from "zod";

// Define Zod schema for the Maven Artifact with version details
const MavenArtifactSchema = z.object({
  groupId: z.string(),
  artifactId: z.string(),
  version: z.string(),
  minecraftVersion: z.string(),
  lastUpdated: z.string().optional(),
  installerUrl: z.string().url().optional(),
  launcherUrl: z.string().url().optional(),
  changelogUrl: z.string().url().optional(),
  isStable: z.boolean().optional(),
  hasLauncher: z.boolean().optional(),
  hasInstaller: z.boolean().optional(),
  hasChangelog: z.boolean().optional(),
  fileSize: z.string().optional(),
  releaseDate: z.string().optional(),
});

// Define the params schema
const VersionParamsSchema = z.object({
  version: z.string().min(1),
});

// Create a type from the schema
type MavenArtifact = z.infer<typeof MavenArtifactSchema>;

// Helper function to extract Minecraft version from Magma version
function extractMinecraftVersion(version: string): string {
  // Handle newer format like 21.1.33-beta
  if (version.startsWith("21.")) {
    return "1.21.x";
  } else if (version.includes("-")) {
    // Handle versions like "1.20.4-0.1.0" where Minecraft version is explicit
    const parts = version.split("-");
    if (parts.length > 0 && parts[0].match(/^\d+\.\d+(\.\d+)?$/)) {
      return parts[0];
    }
  }

  // Fallback to generic pattern extraction
  const match = version.match(/^(\d+\.\d+(?:\.\d+)?)/);
  return match ? match[1] : "Unknown";
}

// Function to check if a file exists in the Maven repository
async function checkFileExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MagmaNeoWebsite/1.0)",
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Function to get file size
async function getFileSize(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MagmaNeoWebsite/1.0)",
      },
    });

    if (response.ok) {
      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        const sizeInBytes = parseInt(contentLength, 10);
        // Convert to appropriate units
        if (sizeInBytes < 1024) {
          return `${sizeInBytes} B`;
        } else if (sizeInBytes < 1024 * 1024) {
          return `${(sizeInBytes / 1024).toFixed(2)} KB`;
        } else {
          return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
        }
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function isVersionLowerThan21_1_41(version: string): boolean {
  const match = version.match(/^21\.1\.(\d+)-/);
  if (match) {
    const minorVersion = parseInt(match[1], 10);
    return minorVersion < 41;
  }
  return false;
}

// Function to get release date from Maven metadata
async function getReleaseDate(version: string): Promise<string | undefined> {
  try {
    const metadataUrl = `https://repo.magmafoundation.org/releases/org/magmafoundation/magma/${version}/maven-metadata.xml`;
    const response = await fetch(metadataUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MagmaNeoWebsite/1.0)",
      },
    });

    if (response.ok) {
      const xmlText = await response.text();
      const $ = cheerio.load(xmlText, { xmlMode: true });
      const timestamp = $("lastUpdated").text().trim();

      if (timestamp && timestamp.length >= 8) {
        // Maven timestamps are in the format YYYYMMDDHHMMSS
        const year = timestamp.substring(0, 4);
        const month = timestamp.substring(4, 6);
        const day = timestamp.substring(6, 8);

        return `${year}-${month}-${day}`;
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

// Function to get detailed version information
async function getVersionDetails(
  version: string
): Promise<MavenArtifact | null> {
  try {
    const minecraftVersion = extractMinecraftVersion(version);
    const isStable =
      !version.includes("beta") &&
      !version.includes("alpha") &&
      !version.includes("snapshot");

    const baseUrl = `https://repo.magmafoundation.org/releases/org/magmafoundation/magma/${version}/magma-${version}`;
    const jarUrl = `${baseUrl}.jar`;
    const launcherJarUrl = `${baseUrl}-launcher.jar`; // The launcher has the -launcher.jar suffix
    const installerUrl = `${baseUrl}-installer.jar`;
    const changelogUrl = `${baseUrl}-changelog.txt`;

    // Check if files exist
    const [hasJar, hasInstaller, hasChangelog] = await Promise.all([
      checkFileExists(jarUrl),
      checkFileExists(installerUrl),
      checkFileExists(changelogUrl),
    ]);

    // For versions 1.40-beta and above, jar is considered a launcher
    const hasLauncher = !isVersionLowerThan21_1_41(version)

    // Get file sizes for available files
    let fileSize;
    if (hasInstaller) {
      fileSize = await getFileSize(installerUrl);
    } else if (hasJar) {
      fileSize = await getFileSize(jarUrl);
    }

    // Get release date
    const releaseDate = await getReleaseDate(version);

    const artifactData = {
      groupId: "org.magmafoundation",
      artifactId: "magma",
      version,
      minecraftVersion,
      installerUrl: hasInstaller ? installerUrl : undefined,
      launcherUrl: hasLauncher ? launcherJarUrl : undefined,
      changelogUrl: hasChangelog ? changelogUrl : undefined,
      isStable,
      hasLauncher,
      hasInstaller,
      hasChangelog,
      fileSize,
      releaseDate,
    };

    // Pre-validate the artifact data with Zod
    const result = MavenArtifactSchema.safeParse(artifactData);
    if (result.success) {
      return result.data;
    } else {
      console.warn(
        `Invalid artifact data for version ${version}:`,
        result.error
      );
      // Return the unvalidated data as a fallback to avoid breaking changes
      return artifactData as MavenArtifact;
    }
  } catch (error) {
    console.error(`Error fetching details for version ${version}:`, error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ version: string }> }
) {
  const params = await context.params;
  try {
    // Validate the version parameter using Zod
    const paramsResult = VersionParamsSchema.safeParse(params);

    if (!paramsResult.success) {
      return NextResponse.json(
        {
          error: "Invalid version parameter",
          details: paramsResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { version } = paramsResult.data;

    // Add caching headers to improve performance
    const versionDetails = await getVersionDetails(version);

    if (!versionDetails) {
      return NextResponse.json(
        { error: `Version ${version} not found` },
        { status: 404 }
      );
    }

    // Validate the version details with Zod
    const versionResult = MavenArtifactSchema.safeParse(versionDetails);

    if (!versionResult.success) {
      console.error("Invalid version data:", versionResult.error);
      return NextResponse.json(
        { error: "Internal server error - invalid version data format" },
        { status: 500 }
      );
    }

    // Return the response with caching headers (1 hour cache)
    return NextResponse.json(versionResult.data, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error(`Error in version API for ${params.version}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch version details" },
      { status: 500 }
    );
  }
}
