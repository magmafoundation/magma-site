import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchVersions, getDownloadUrl } from "@/lib/maven";

const TypeSchema = z.enum(["jar", "installer", "launcher", "changelog"]);

export async function GET(request: NextRequest) {
    try {
        const type = request.nextUrl.searchParams.get("type") || "launcher";
        const tResult = TypeSchema.safeParse(type);
        if (!tResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid type. Must be: jar, installer, launcher, changelog",
                },
                { status: 400 },
            );
        }

        const { versions } = await fetchVersions(1);
        if (versions.length === 0) {
            return NextResponse.json(
                { error: "No versions available" },
                { status: 404 },
            );
        }

        const url = getDownloadUrl(versions[0].version, tResult.data);

        return NextResponse.redirect(url, {
            headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" },
        });
    } catch (error) {
        console.error("Error in latest download API:", error);
        return NextResponse.json(
            { error: "Failed to process download request" },
            { status: 500 },
        );
    }
}
