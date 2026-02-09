import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getBaseUrl } from "@/lib/baseurl";

// Define a schema for download type validation
const DownloadTypeSchema = z.enum([
    "jar",
    "installer",
    "launcher",
    "changelog",
]);

// Define Zod schema for the versions API response
const VersionsResponseSchema = z.object({
    total: z.number(),
    limit: z.number(),
    versions: z.array(
        z.object({
            version: z.string(),
            // Include other fields as needed but we only use version here
        }),
    ),
});

export async function GET(request: NextRequest) {
    try {
        const requestHeaders = await headers();
        const baseUrl = getBaseUrl(requestHeaders);

        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "launcher"; // Default to launcher

        // Validate type parameter using Zod
        const typeResult = DownloadTypeSchema.safeParse(type);

        if (!typeResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid type parameter. Must be one of: jar, installer, launcher, changelog",
                    details: typeResult.error.format(),
                },
                { status: 400 },
            );
        }

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

        // Validate the versions data using Zod
        const versionsResult = VersionsResponseSchema.safeParse(versionsData);

        if (!versionsResult.success) {
            console.error("Invalid versions data:", versionsResult.error);
            return NextResponse.json(
                { error: "Failed to retrieve valid version data" },
                { status: 500 },
            );
        }

        if (versionsResult.data.versions.length === 0) {
            return NextResponse.json(
                { error: "No versions available" },
                { status: 404 },
            );
        }

        // Get the latest version
        const latestVersion = versionsResult.data.versions[0].version;

        // Redirect to the download endpoint for the specific version
        const downloadUrl = `${baseUrl}/api/versions/${latestVersion}/download?type=${type}`;

        return NextResponse.redirect(downloadUrl, {
            headers: {
                "Cache-Control": "public, max-age=3600, s-maxage=3600",
            },
        });
    } catch (error) {
        console.error("Error in latest version download API:", error);
        return NextResponse.json(
            { error: "Failed to process download request" },
            { status: 500 },
        );
    }
}
