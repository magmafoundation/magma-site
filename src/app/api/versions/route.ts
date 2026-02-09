import * as cheerio from "cheerio";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define Zod schema for the Maven Artifact
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
});

// Define the query parameters schema
const QueryParamsSchema = z.object({
    limit: z.coerce.number().int().nonnegative().optional().default(10),
});

// Define response schema
const VersionsResponseSchema = z.object({
    total: z.number(),
    limit: z.number(),
    versions: z.array(MavenArtifactSchema),
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

function isVersionLowerThan21_1_41(version: string): boolean {
    const match = version.match(/^21\.1\.(\d+)-/);
    if (match) {
        const minorVersion = parseInt(match[1], 10);
        return minorVersion < 41;
    }
    return false;
}

async function fetchMavenVersions(): Promise<MavenArtifact[]> {
    try {
        // The URL you provided is a web interface, which is difficult to scrape directly.
        // For Maven repositories, we can typically fetch the maven-metadata.xml file which contains version information
        const metadataUrl =
            "https://repo.magmafoundation.org/releases/org/magmafoundation/magma/maven-metadata.xml";

        const response = await fetch(metadataUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; MagmaNeoWebsite/1.0)",
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        const artifacts: MavenArtifact[] = [];

        if (response.ok) {
            const xmlText = await response.text();
            const $ = cheerio.load(xmlText, { xmlMode: true });

            // Extract versions from maven-metadata.xml
            $("version").each((_, element) => {
                const version = $(element).text().trim();

                if (version) {
                    const minecraftVersion = extractMinecraftVersion(version);
                    const isStable =
                        !version.includes("beta") &&
                        !version.includes("alpha") &&
                        !version.includes("snapshot");

                    const artifact = {
                        groupId: "org.magmafoundation",
                        artifactId: "magma",
                        version: version,
                        minecraftVersion: minecraftVersion,
                        installerUrl: `https://repo.magmafoundation.org/releases/org/magmafoundation/magma/${version}/magma-${version}-installer.jar`,
                        // Launcher has the -launcher.jar suffix
                        launcherUrl: `https://repo.magmafoundation.org/releases/org/magmafoundation/magma/${version}/magma-${version}-launcher.jar`,
                        changelogUrl: `https://repo.magmafoundation.org/releases/org/magmafoundation/magma/${version}/magma-${version}-changelog.txt`,
                        isStable: isStable,
                        // All versions have installer
                        hasInstaller: true,
                        // Only versions 1.40-beta and above have launcher
                        hasLauncher: !isVersionLowerThan21_1_41(version),
                    };

                    // Validate the artifact with Zod
                    const result = MavenArtifactSchema.safeParse(artifact);
                    if (result.success) {
                        artifacts.push(result.data);
                    } else {
                        console.warn(
                            `Invalid artifact data for version ${version}:`,
                            result.error,
                        );
                    }
                }
            });
        }

        // If we couldn't fetch the metadata or parse versions, try to fetch directory listing
        if (artifacts.length === 0) {
            const directoryUrl =
                "https://repo.magmafoundation.org/releases/org/magmafoundation/magma/";
            const dirResponse = await fetch(directoryUrl, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (compatible; MagmaNeoWebsite/1.0)",
                },
                next: { revalidate: 3600 }, // Cache for 1 hour
            });

            if (dirResponse.ok) {
                const html = await dirResponse.text();
                const $ = cheerio.load(html);

                // Look for directory links that likely represent versions
                $("a").each((_, element) => {
                    const href = $(element).attr("href");
                    const text = $(element).text().trim();

                    // Typical Maven repository directories end with /
                    if (
                        href?.endsWith("/") &&
                        !["../", "./"].includes(href) &&
                        !text.includes("maven-metadata")
                    ) {
                        // Extract version from directory name
                        const version = href.replace("/", "");
                        const minecraftVersion =
                            extractMinecraftVersion(version);
                        const isStable =
                            !version.includes("beta") &&
                            !version.includes("alpha") &&
                            !version.includes("snapshot");

                        const artifact = {
                            groupId: "org.magmafoundation",
                            artifactId: "magma",
                            version: version,
                            minecraftVersion: minecraftVersion,
                            installerUrl: `https://repo.magmafoundation.org/releases/org/magmafoundation/magma/${version}/magma-${version}-installer.jar`,
                            launcherUrl: `https://repo.magmafoundation.org/releases/org/magmafoundation/magma/${version}/magma-${version}-launcher.jar`,
                            changelogUrl: `https://repo.magmafoundation.org/releases/org/magmafoundation/magma/${version}/magma-${version}-changelog.txt`,
                            isStable: isStable,
                            hasInstaller: true,
                            // Only versions 1.40-beta and above have launcher
                            hasLauncher: !isVersionLowerThan21_1_41(version),
                        };

                        // Validate the artifact with Zod
                        const result = MavenArtifactSchema.safeParse(artifact);
                        if (result.success) {
                            artifacts.push(result.data);
                        } else {
                            console.warn(
                                `Invalid artifact data for version ${version}:`,
                                result.error,
                            );
                        }
                    }
                });
            }
        }

        // If we still couldn't get any versions, return an empty array instead of fallback data
        if (artifacts.length === 0) {
            console.warn(
                "Could not fetch versions from Maven repository, returning empty array",
            );
            return [];
        }

        // Sort versions in descending order (latest first)
        artifacts.sort((a, b) => {
            return b.version.localeCompare(a.version, undefined, {
                numeric: true,
                sensitivity: "base",
            });
        });

        return artifacts;
    } catch (error) {
        console.error("Error fetching Maven versions:", error);
        return [];
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse and validate query parameters using Zod
        const queryParamsResult = QueryParamsSchema.safeParse({
            limit: searchParams.get("limit"),
        });

        if (!queryParamsResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid query parameters",
                    details: queryParamsResult.error.format(),
                },
                { status: 400 },
            );
        }

        const { limit } = queryParamsResult.data;
        const versions = await fetchMavenVersions();

        // Apply limit if specified and valid
        const totalVersions = versions.length;
        let limitedVersions = versions;

        // If limit is 0, show all versions, otherwise apply the limit
        if (limit > 0) {
            limitedVersions = versions.slice(0, limit);
        }
        // When limit is 0, use all versions (limitedVersions already contains all versions)

        // Validate the response with Zod
        const responseData = {
            total: totalVersions,
            limit: limit,
            versions: limitedVersions,
        };

        const responseResult = VersionsResponseSchema.safeParse(responseData);

        if (!responseResult.success) {
            console.error("Invalid response data:", responseResult.error);
            return NextResponse.json(
                { error: "Internal server error - invalid response format" },
                { status: 500 },
            );
        }

        return NextResponse.json(responseResult.data);
    } catch (error) {
        console.error("Error in versions API:", error);
        return NextResponse.json(
            { error: "Failed to fetch versions" },
            { status: 500 },
        );
    }
}
