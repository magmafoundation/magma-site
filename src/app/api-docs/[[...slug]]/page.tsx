import {
    DocsBody,
    DocsDescription,
    DocsPage,
    DocsTitle,
    EditOnGitHub,
    PageLastUpdate,
} from "fumadocs-ui/layouts/docs/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { notFound } from "next/navigation";
import { apiDocsSource } from "@/lib/source";

export default async function Page(props: {
    params: Promise<{ slug?: string[] }>;
}) {
    const params = await props.params;
    const page = apiDocsSource.getPage(params.slug);
    if (!page) notFound();

    const MDX = page.data.body;

    return (
        <DocsPage toc={page.data.toc} full={page.data.full}>
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription>{page.data.description}</DocsDescription>
            <DocsBody>
                <MDX components={defaultMdxComponents} />
            </DocsBody>
            <EditOnGitHub
                href={`https://github.com/magmafoundation/magma-site/blob/main/content/api/${page.path}`}
            />
            {page.data.lastModified ? (
                <PageLastUpdate date={page.data.lastModified} />
            ) : null}
        </DocsPage>
    );
}

export async function generateStaticParams() {
    return apiDocsSource.generateParams();
}

export async function generateMetadata(props: {
    params: Promise<{ slug?: string[] }>;
}) {
    const params = await props.params;
    const page = apiDocsSource.getPage(params.slug);
    if (!page) notFound();

    return {
        title: page.data.title,
        description: page.data.description,
        openGraph: {
            url: `api-docs/${page.slugs.join("/")}`,
            images: `/og/${page.slugs.join("/")}`,
        },
    };
}
