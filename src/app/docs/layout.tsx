import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { cn } from "@/lib/utils";

const LeftRadialGradient = ({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("absolute inset-0 -z-10", className)}
      style={{
        ...style,
        backgroundImage:
          "radial-gradient(130% 60% at 0% 50%, rgba(239, 138, 94, 0.1), rgba(255, 255, 255, 0))",
      }}
      {...props}
    />
  );
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      sidebar={{
        enabled: true,
        banner: <LeftRadialGradient />,
      }}
      containerProps={{
        // Hide the theme toggle and search component in the docs sidebar
        className:
          "[&_[data-theme-toggle]]:hidden [&_[data-search-full]]:hidden",
      }}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
