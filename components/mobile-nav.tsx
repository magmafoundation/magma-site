"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Server, Download, BookOpen, Users, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-2">
              <Image
                src="/magma-icon.png"
                alt="MagmaNeo Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-bold text-xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                MagmaNeo
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          <SheetClose asChild>
            <Link
              href="#features"
              className="flex items-center gap-2 px-4 py-2 text-base font-medium rounded-md hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              <Server className="h-5 w-5 text-orange-500" />
              Features
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="#download"
              className="flex items-center gap-2 px-4 py-2 text-base font-medium rounded-md hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              <Download className="h-5 w-5 text-orange-500" />
              Download
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="#docs"
              className="flex items-center gap-2 px-4 py-2 text-base font-medium rounded-md hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              <BookOpen className="h-5 w-5 text-orange-500" />
              Documentation
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="#community"
              className="flex items-center gap-2 px-4 py-2 text-base font-medium rounded-md hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              <Users className="h-5 w-5 text-orange-500" />
              Community
            </Link>
          </SheetClose>
          <div className="h-px bg-border my-2" />
          <SheetClose asChild>
            <Link
              href="https://github.com"
              className="flex items-center gap-2 px-4 py-2 text-base font-medium rounded-md hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              <Github className="h-5 w-5 text-orange-500" />
              GitHub
            </Link>
          </SheetClose>
          <div className="flex items-center gap-2 px-4 py-2">
            <span className="text-base font-medium">Theme</span>
            <ThemeToggle />
          </div>
          <SheetClose asChild>
            <Button
              className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              onClick={() => setOpen(false)}
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
