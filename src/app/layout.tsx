import type React from "react";
import "./css/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { RootProvider } from "fumadocs-ui/provider";
import { SidebarProvider } from "fumadocs-core/sidebar";

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
        <SidebarProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <RootProvider
              search={{
                options: {
                  defaultTag: "docs",
                  tags: [
                    {
                      name: "docs",
                      value: "docs",
                    },
                    {
                      name: "site-api",
                      value: "site-api",
                    },
                  ],
                },
              }}
            >
              {children}
            </RootProvider>
            <Toaster />
          </ThemeProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
