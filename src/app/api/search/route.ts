import { createSearchAPI } from "fumadocs-core/search/server";
import { apiDocsSource, source } from "@/lib/source";

export const revalidate = false;

export const { GET } = createSearchAPI("advanced", {
    indexes: [
        ...source.getPages().map((page) => ({
            title: page.data.title,
            description: page.data.description,
            url: page.url,
            id: page.url,
            structuredData: page.data.structuredData,
            tag: "docs",
        })),
        ...apiDocsSource.getPages().map((page) => ({
            title: page.data.title,
            description: page.data.description,
            url: page.url,
            id: page.url,
            structuredData: page.data.structuredData,
            tag: "site-api",
        })),
    ],
});
