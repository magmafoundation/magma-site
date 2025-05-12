import { generateOGImage } from "fumadocs-ui/og";
import { metadataImage } from "@/lib/metadata-image";

export const GET = metadataImage.createAPI((page) => {
  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: "Magma Docs",
    primaryColor: "hsl(240 3.7% 15.9%)",
    primaryTextColor: "#f97316",
  });
});

export function generateStaticParams() {
  return metadataImage.generateParams();
}
