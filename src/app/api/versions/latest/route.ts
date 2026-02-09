import { NextResponse } from "next/server";
import { fetchVersionDetails, fetchVersions } from "@/lib/maven";

export async function GET() {
    try {
        const { versions } = await fetchVersions(1);
        if (versions.length === 0) {
            return NextResponse.json(
                { error: "No versions available" },
                { status: 404 },
            );
        }

        const latest = versions[0];
        const details = await fetchVersionDetails(latest.version);

        return NextResponse.json(details ?? latest, {
            headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" },
        });
    } catch (error) {
        console.error("Error in latest version API:", error);
        return NextResponse.json(
            { error: "Failed to fetch latest version" },
            { status: 500 },
        );
    }
}
