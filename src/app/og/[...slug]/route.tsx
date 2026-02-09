import { generateOGImage } from "fumadocs-ui/og";
import { notFound } from "next/navigation";
import { source } from "@/lib/source";

export async function GET(
    _req: Request,
    props: { params: Promise<{ slug: string[] }> },
) {
    const params = await props.params;
    const page = source.getPage(params.slug);
    if (!page) notFound();

    return generateOGImage({
        title: page.data.title,
        description: page.data.description,
        site: "Magma Docs",
        primaryColor: "hsl(240 3.7% 15.9%)",
        primaryTextColor: "#f97316",
    });
}

export function generateStaticParams() {
    return source.generateParams().filter((params) => params.slug.length > 0);
}
