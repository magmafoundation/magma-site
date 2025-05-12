"use client";

import Link from "next/link";
import Image from "next/image";
import { Download, Code, BookOpen, Search, X, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { useSearchContext, useSidebar } from "fumadocs-ui/provider";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "fumadocs-core/sidebar";

const PAGES = [
  {
    name: "Documentation",
    href: "/docs",
    icon: <BookOpen className="mr-1.5 h-4 w-4" />,
  },
  {
    name: "Downloads",
    href: "/downloads",
    icon: <Download className="mr-1.5 h-4 w-4" />,
  },
  {
    name: "API",
    href: "/docs/reference/website-api",
    icon: <Code className="mr-1.5 h-4 w-4" />,
  },
];

export function MainNav() {
  const { setOpenSearch } = useSearchContext();
  const { open: isSidebarOpen, setOpen } = useSidebar();

  const pathName = usePathname();
  const isDocsPage = /^\/docs/.test(pathName);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/magma-icon.png"
              alt="Magma Logo"
              width={40}
              height={40}
              className="h-8 w-8"
            />
            <span className="inline-block font-bold text-xl bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Magma
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {PAGES.map((page) => (
              <Link
                key={page.name}
                href={page.href}
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-orange-500"
              >
                {page.icon}
                {page.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button
              onClick={() => setOpenSearch(true)}
              variant={"outline"}
              size={"sm"}
              className="gap-2 hidden md:flex"
            >
              <Search size={16} className="text-muted-foreground" />
              <span className="inline-block text-muted-foreground">
                Search...
              </span>
              <div className="ml-4 inline-flex h-5 gap-1 rounded-full border-small px-2 py-px">
                <kbd className="text-xxs">Ctrl+</kbd>
                <kbd className="text-xxs">K</kbd>
              </div>
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden md:flex"
            >
              <Link
                href="https://github.com/magmafoundation/Magma-Neo"
                aria-label="GitHub"
              >
                <SiGithub className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="default"
              className="hidden md:flex bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              asChild
            >
              <Link href="/downloads">
                <Download className="mr-2 h-4 w-4" /> Download
              </Link>
            </Button>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setOpenSearch(true)}
                className="inline-flex size-8 items-center justify-center text-muted-foreground transition duration-200 hover:text-secondary"
              >
                <Search />
              </button>
              {isDocsPage && (
                <SidebarTrigger onClick={() => setOpen(true)}>
                  {isSidebarOpen ? <X /> : <Menu />}
                </SidebarTrigger>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
