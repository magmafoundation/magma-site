import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchVersions } from "@/lib/maven";

const QuerySchema = z.object({
    limit: z.coerce.number().int().nonnegative().optional().default(10),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = QuerySchema.safeParse({
            limit: searchParams.get("limit"),
        });

        if (!query.success) {
            return NextResponse.json(
                {
                    error: "Invalid query parameters",
                    details: query.error.format(),
                },
                { status: 400 },
            );
        }

        const { total, versions } = await fetchVersions(query.data.limit);

        return NextResponse.json({
            total,
            limit: query.data.limit,
            versions,
        });
    } catch (error) {
        console.error("Error in versions API:", error);
        return NextResponse.json(
            { error: "Failed to fetch versions" },
            { status: 500 },
        );
    }
}
