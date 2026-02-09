import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getBaseUrl } from "../../../lib/baseurl";

/**
 * Direct download route handler for /downloads/magma.jar
 * This provides a convenient URL for downloading the latest Magma launcher JAR
 */
export async function GET() {
    try {
        const requestHeaders = await headers();
        const baseUrl = getBaseUrl(requestHeaders);

        // Fetch the latest version from the versions endpoint with limit=1
        const versionsResponse = await fetch(
            `${baseUrl}/api/versions?limit=1`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (compatible; MagmaNeoWebsite/1.0)",
                },
                next: { revalidate: 3600 }, // Cache for 1 hour
            },
        );

        if (!versionsResponse.ok) {
            throw new Error(
                `Failed to fetch versions: ${versionsResponse.status}`,
            );
        }

        const versionsData = await versionsResponse.json();

        if (!versionsData.versions || versionsData.versions.length === 0) {
            return NextResponse.json(
                { error: "No versions available" },
                { status: 404 },
            );
        }

        // Get the latest version
        const latestVersion = versionsData.versions[0].version;

        // Get the download URL for the specific version
        const mavenBaseUrl = `https://repo.magmafoundation.org/releases/org/magmafoundation/magma/${latestVersion}/magma-${latestVersion}`;
        const launcherUrl = `${mavenBaseUrl}-launcher.jar`;

        // Check if launcher exists
        const launcherCheck = await fetch(launcherUrl, {
            method: "HEAD",
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; MagmaNeoWebsite/1.0)",
            },
            next: { revalidate: 3600 },
        });

        // If launcher doesn't exist, fall back to regular jar
        if (!launcherCheck.ok) {
            const jarUrl = `${mavenBaseUrl}.jar`;

            // Check if jar exists
            const jarCheck = await fetch(jarUrl, {
                method: "HEAD",
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (compatible; MagmaNeoWebsite/1.0)",
                },
                next: { revalidate: 3600 },
            });

            if (!jarCheck.ok) {
                return NextResponse.json(
                    { error: "No download available for the latest version" },
                    { status: 404 },
                );
            }

            // Redirect to the jar instead
            return NextResponse.redirect(jarUrl, {
                headers: {
                    "Cache-Control": "public, max-age=3600, s-maxage=3600",
                },
            });
        }

        // Redirect to the launcher download URL with cache control headers
        // Using attachment disposition to ensure the file is downloaded with the right filename
        return NextResponse.redirect(launcherUrl, {
            headers: {
                "Cache-Control": "public, max-age=3600, s-maxage=3600",
                "Content-Disposition": `attachment; filename="magma.jar"`,
            },
        });
    } catch (error) {
        console.error("Error in magma.jar download API:", error);
        return NextResponse.json(
            { error: "Failed to process download request" },
            { status: 500 },
        );
    }
}
