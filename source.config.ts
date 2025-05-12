import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
});

export const siteApi = defineDocs({
  dir: "content/api",
});

export default defineConfig({
  lastModifiedTime: "git",
});
