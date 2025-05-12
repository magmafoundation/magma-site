import { NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { getBaseUrl } from "@/lib/baseurl";

// Define Zod schema for the Maven Artifact
const MavenArtifactSchema = z.object({
  groupId: z.string(),
  artifactId: z.string(),
  version: z.string(),
  minecraftVersion: z.string(),
  lastUpdated: z.string().optional(),
  downloadUrl: z.string().url().optional(),
  installerUrl: z.string().url().optional(),
  changelogUrl: z.string().url().optional(),
  isStable: z.boolean().optional(),
  hasServerJar: z.boolean().optional(),
  hasInstaller: z.boolean().optional(),
  hasChangelog: z.boolean().optional(),
  fileSize: z.string().optional(),
  releaseDate: z.string().optional(),
});

// Define response schema for versions API
const VersionsResponseSchema = z.object({
  total: z.number(),
  limit: z.number(),
  versions: z.array(MavenArtifactSchema),
});

export async function GET() {
  try {
    const requestHeaders = await headers();
    const baseUrl = getBaseUrl(requestHeaders);

    // Fetch the latest version from the versions endpoint with limit=1
    const versionsResponse = await fetch(`${baseUrl}/api/versions?limit=1`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MagmaNeoWebsite/1.0)",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!versionsResponse.ok) {
      throw new Error(`Failed to fetch versions: ${versionsResponse.status}`);
    }

    const versionsData = await versionsResponse.json();

    // Validate the versions data
    const versionsResult = VersionsResponseSchema.safeParse(versionsData);

    if (!versionsResult.success) {
      console.error("Invalid versions data:", versionsResult.error);
      return NextResponse.json(
        { error: "Failed to retrieve valid version data" },
        { status: 500 }
      );
    }

    if (versionsResult.data.versions.length === 0) {
      return NextResponse.json(
        { error: "No versions available" },
        { status: 404 }
      );
    }

    // Get the latest version
    const latestVersion = versionsResult.data.versions[0];

    // Fetch detailed information for the latest version
    const detailsResponse = await fetch(
      `${baseUrl}/api/versions/${latestVersion.version}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; MagmaNeoWebsite/1.0)",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    let versionDetails;
    if (detailsResponse.ok) {
      const detailsData = await detailsResponse.json();

      // Validate the version details
      const detailsResult = MavenArtifactSchema.safeParse(detailsData);

      if (detailsResult.success) {
        versionDetails = detailsResult.data;
      } else {
        console.warn("Invalid version details:", detailsResult.error);
        // Fallback to already validated basic version info
        versionDetails = latestVersion;
      }
    } else {
      // Fallback to basic version info if detailed info can't be fetched
      versionDetails = latestVersion;
    }

    // Return the response with caching headers
    return NextResponse.json(versionDetails, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error in latest version API:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest version" },
      { status: 500 }
    );
  }
}
