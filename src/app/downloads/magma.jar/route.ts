import { NextResponse } from "next/server";
import { checkFileExists, fetchVersions, getDownloadUrl } from "@/lib/maven";

export async function GET() {
    try {
        const { versions } = await fetchVersions(1);
        if (versions.length === 0) {
            return NextResponse.json(
                { error: "No versions available" },
                { status: 404 },
            );
        }

        const version = versions[0].version;

        // Try launcher first, fall back to regular jar
        const launcherUrl = getDownloadUrl(version, "launcher");
        if (await checkFileExists(launcherUrl)) {
            return NextResponse.redirect(launcherUrl, {
                headers: {
                    "Cache-Control": "public, max-age=3600, s-maxage=3600",
                },
            });
        }

        const jarUrl = getDownloadUrl(version, "jar");
        if (await checkFileExists(jarUrl)) {
            return NextResponse.redirect(jarUrl, {
                headers: {
                    "Cache-Control": "public, max-age=3600, s-maxage=3600",
                },
            });
        }

        return NextResponse.json(
            { error: "No download available for the latest version" },
            { status: 404 },
        );
    } catch (error) {
        console.error("Error in magma.jar download API:", error);
        return NextResponse.json(
            { error: "Failed to process download request" },
            { status: 500 },
        );
    }
}
