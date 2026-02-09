import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookOpen, Code, Download } from "lucide-react";
import Image from "next/image";

export const baseOptions: BaseLayoutProps = {
    nav: {
        title: (
            <div className="flex items-center space-x-2">
                <Image
                    src="/magma-icon.png"
                    alt="Magma Logo"
                    width={32}
                    height={32}
                />
                <span className="font-bold text-lg bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Magma
                </span>
            </div>
        ),
    },
    githubUrl: "https://github.com/magmafoundation/Magma-Neo",
    links: [
        {
            text: "Documentation",
            url: "/docs",
            icon: <BookOpen />,
            active: "nested-url",
        },
        {
            text: "API",
            url: "/api-docs",
            icon: <Code />,
            active: "nested-url",
        },
        {
            text: "Download",
            url: "/downloads",
            icon: <Download />,
            active: "nested-url",
        },
    ],
};
