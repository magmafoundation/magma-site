import { docs, siteApi } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";

export const source = loader({
    baseUrl: "/docs",
    source: docs.toFumadocsSource(),
});

export const apiDocsSource = loader({
    baseUrl: "/api-docs",
    source: siteApi.toFumadocsSource(),
});
