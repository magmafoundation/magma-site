import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchVersionDetails } from "@/lib/maven";

const ParamsSchema = z.object({
    version: z.string().min(1),
});

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ version: string }> },
) {
    const params = await context.params;
    try {
        const result = ParamsSchema.safeParse(params);
        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Invalid version parameter",
                    details: result.error.format(),
                },
                { status: 400 },
            );
        }

        const details = await fetchVersionDetails(result.data.version);
        if (!details) {
            return NextResponse.json(
                { error: `Version ${result.data.version} not found` },
                { status: 404 },
            );
        }

        return NextResponse.json(details, {
            headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" },
        });
    } catch (error) {
        console.error(`Error in version API for ${params.version}:`, error);
        return NextResponse.json(
            { error: "Failed to fetch version details" },
            { status: 500 },
        );
    }
}
