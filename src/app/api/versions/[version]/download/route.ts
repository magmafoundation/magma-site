import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkFileExists, getDownloadUrl } from "@/lib/maven";

const ParamsSchema = z.object({ version: z.string().min(1) });
const TypeSchema = z.enum(["jar", "installer", "launcher", "changelog"]);

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ version: string }> },
) {
    const params = await context.params;
    try {
        const vResult = ParamsSchema.safeParse(params);
        if (!vResult.success) {
            return NextResponse.json(
                { error: "Invalid version parameter" },
                { status: 400 },
            );
        }

        const type = request.nextUrl.searchParams.get("type") || "installer";
        const tResult = TypeSchema.safeParse(type);
        if (!tResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid type. Must be: jar, installer, launcher, changelog",
                },
                { status: 400 },
            );
        }

        const { version } = vResult.data;
        const downloadType = tResult.data;
        let url = getDownloadUrl(version, downloadType);

        const exists = await checkFileExists(url);
        if (!exists) {
            // Launcher fallback: try regular jar
            if (downloadType === "launcher") {
                const jarUrl = getDownloadUrl(version, "jar");
                if (await checkFileExists(jarUrl)) {
                    url = jarUrl;
                } else {
                    return NextResponse.json(
                        {
                            error: `No download available for version ${version}`,
                        },
                        { status: 404 },
                    );
                }
            } else {
                return NextResponse.json(
                    {
                        error: `${downloadType} file not found for version ${version}`,
                    },
                    { status: 404 },
                );
            }
        }

        return NextResponse.redirect(url, {
            headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" },
        });
    } catch (error) {
        console.error(`Error in download API for ${params.version}:`, error);
        return NextResponse.json(
            { error: "Failed to process download request" },
            { status: 500 },
        );
    }
}
