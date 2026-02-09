import type React from "react";
import "./css/globals.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import SearchDialog from "@/components/search-dialog";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Magma - Run NeoForge Mods and Bukkit Plugins Together",
    description:
        "Magma is the ultimate Minecraft server software that combines the power of NeoForge mods and Bukkit plugins in one seamless experience.",
    icons: {
        icon: "/magma-icon.png",
    },
    metadataBase: new URL("https://magmafoundation.org"),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <RootProvider
                    theme={{
                        attribute: "class",
                        defaultTheme: "dark",
                        enableSystem: true,
                        disableTransitionOnChange: true,
                    }}
                    search={{
                        SearchDialog,
                    }}
                >
                    {children}
                    <Toaster />
                </RootProvider>
            </body>
        </html>
    );
}
