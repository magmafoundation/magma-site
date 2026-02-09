import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import {
    ArrowRight,
    BookOpen,
    ChevronRight,
    Code,
    Download,
    Puzzle,
    Server,
    Users,
    Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LatestVersionDownload } from "@/components/latest-version-download";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {/* Hero */}
                <section className="relative overflow-hidden border-b">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
                    <div className="container mx-auto relative px-4 md:px-6 py-16 md:py-24 lg:py-32">
                        <div className="mx-auto max-w-3xl text-center space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border bg-fd-muted px-4 py-1.5 text-sm text-fd-muted-foreground">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                                </span>
                                Minecraft 1.21.1 now supported
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                Run{" "}
                                <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                                    NeoForge Mods
                                </span>{" "}
                                and{" "}
                                <span className="bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
                                    Bukkit Plugins
                                </span>{" "}
                                Together
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg text-fd-muted-foreground">
                                Magma is the Minecraft server software that
                                combines NeoForge mods and Bukkit plugins in one
                                seamless experience.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link
                                    href="/downloads"
                                    className="inline-flex h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-6 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </Link>
                                <Link
                                    href="/docs"
                                    className="inline-flex h-11 items-center gap-2 rounded-lg border bg-fd-background px-6 text-sm font-medium transition-colors hover:bg-fd-accent"
                                >
                                    Documentation
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="border-b py-16 md:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="mx-auto max-w-2xl text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight">
                                Why Choose Magma?
                            </h2>
                            <p className="mt-3 text-fd-muted-foreground">
                                The best of both worlds for your Minecraft
                                server.
                            </p>
                        </div>
                        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    icon: Puzzle,
                                    title: "NeoForge Mods",
                                    description:
                                        "Run your favorite NeoForge mods to enhance gameplay and add new content.",
                                    color: "text-orange-500",
                                    bg: "bg-orange-500/10",
                                },
                                {
                                    icon: Code,
                                    title: "Bukkit Plugins",
                                    description:
                                        "Utilize Bukkit plugins for server management, protection, and administration.",
                                    color: "text-red-500",
                                    bg: "bg-red-500/10",
                                },
                                {
                                    icon: Zap,
                                    title: "Optimized Performance",
                                    description:
                                        "Improved server performance with an optimized codebase and efficient resource usage.",
                                    color: "text-amber-500",
                                    bg: "bg-amber-500/10",
                                },
                                {
                                    icon: Server,
                                    title: "Easy Setup",
                                    description:
                                        "Get your server running quickly with a simple installation process.",
                                    color: "text-green-500",
                                    bg: "bg-green-500/10",
                                },
                                {
                                    icon: Users,
                                    title: "Active Community",
                                    description:
                                        "Join a growing community of server owners and developers.",
                                    color: "text-blue-500",
                                    bg: "bg-blue-500/10",
                                },
                                {
                                    icon: BookOpen,
                                    title: "Comprehensive Docs",
                                    description:
                                        "Detailed documentation to help you make the most of Magma.",
                                    color: "text-purple-500",
                                    bg: "bg-purple-500/10",
                                },
                            ].map((feature) => (
                                <div
                                    key={feature.title}
                                    className="group rounded-xl border bg-fd-card p-6 transition-colors hover:bg-fd-accent/50"
                                >
                                    <div
                                        className={`mb-4 inline-flex rounded-lg ${feature.bg} p-2.5`}
                                    >
                                        <feature.icon
                                            className={`h-5 w-5 ${feature.color}`}
                                        />
                                    </div>
                                    <h3 className="font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-fd-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Download */}
                <section className="border-b py-16 md:py-24 bg-fd-muted/50">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="mx-auto max-w-2xl text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight">
                                Get Magma Today
                            </h2>
                            <p className="mt-3 text-fd-muted-foreground">
                                Download the latest version and start running
                                NeoForge mods and Bukkit plugins together.
                            </p>
                        </div>
                        <div className="mx-auto max-w-md">
                            <LatestVersionDownload />
                        </div>
                    </div>
                </section>

                {/* Docs Preview */}
                <section className="border-b py-16 md:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid gap-12 lg:grid-cols-2 items-center">
                            <div className="order-2 lg:order-1">
                                <div className="overflow-hidden rounded-xl border bg-fd-card shadow-lg">
                                    <div className="flex items-center gap-2 border-b px-4 py-3">
                                        <div className="h-3 w-3 rounded-full bg-red-500/60" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                                        <div className="h-3 w-3 rounded-full bg-green-500/60" />
                                        <span className="ml-2 text-sm text-fd-muted-foreground">
                                            Installation Guide
                                        </span>
                                    </div>
                                    <div className="p-4 md:p-6 space-y-4 text-sm">
                                        <div>
                                            <h4 className="font-semibold mb-2">
                                                Requirements
                                            </h4>
                                            <ul className="space-y-1 text-fd-muted-foreground">
                                                <li className="flex items-center gap-2">
                                                    <ChevronRight className="h-3 w-3 text-orange-500" />
                                                    Java 21 or newer
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <ChevronRight className="h-3 w-3 text-orange-500" />
                                                    Minimum 4GB RAM
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">
                                                Quick Start
                                            </h4>
                                            <div className="rounded-lg bg-fd-muted p-3 font-mono text-xs">
                                                <div className="text-fd-muted-foreground">
                                                    # Download Magma
                                                </div>
                                                <div>
                                                    wget
                                                    magmafoundation.org/downloads/magma.jar
                                                </div>
                                                <div className="mt-2 text-fd-muted-foreground">
                                                    # Start the server
                                                </div>
                                                <div>
                                                    java -Xmx4G -jar magma.jar
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 space-y-4">
                                <h2 className="text-3xl font-bold tracking-tight">
                                    Comprehensive Documentation
                                </h2>
                                <p className="text-fd-muted-foreground">
                                    Everything from installation to advanced
                                    configuration and troubleshooting.
                                </p>
                                <ul className="space-y-2">
                                    {[
                                        "Installation guides for different operating systems",
                                        "Mod and plugin compatibility lists",
                                        "Performance optimization tips",
                                        "Troubleshooting common issues",
                                    ].map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <ChevronRight className="h-4 w-4 text-orange-500 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                    <li className="flex items-center gap-2 text-sm">
                                        <ChevronRight className="h-4 w-4 text-orange-500 shrink-0" />
                                        <Link
                                            href="/api-docs"
                                            className="text-fd-primary hover:underline"
                                        >
                                            API documentation
                                        </Link>{" "}
                                        for developers
                                    </li>
                                </ul>
                                <div className="pt-2">
                                    <Link
                                        href="/docs"
                                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                                    >
                                        Browse Documentation
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Community */}
                <section className="py-16 md:py-24 bg-fd-muted/50">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="mx-auto max-w-2xl text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight">
                                Join Our Community
                            </h2>
                            <p className="mt-3 text-fd-muted-foreground">
                                Connect with other Magma users, get support, and
                                contribute to the project.
                            </p>
                        </div>
                        <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
                            <a
                                href="https://discord.gg/magma"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-center gap-4 rounded-xl border bg-fd-card p-6 text-center transition-colors hover:bg-fd-accent/50"
                            >
                                <SiDiscord className="h-10 w-10" />
                                <div>
                                    <h3 className="font-semibold">Discord</h3>
                                    <p className="mt-1 text-sm text-fd-muted-foreground">
                                        Chat with other users and get real-time
                                        support.
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1 text-sm text-fd-muted-foreground group-hover:text-fd-foreground transition-colors">
                                    Join Discord{" "}
                                    <ArrowRight className="h-3 w-3" />
                                </span>
                            </a>
                            <a
                                href="https://github.com/magmafoundation/Magma-Neo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-center gap-4 rounded-xl border bg-fd-card p-6 text-center transition-colors hover:bg-fd-accent/50"
                            >
                                <SiGithub className="h-10 w-10" />
                                <div>
                                    <h3 className="font-semibold">GitHub</h3>
                                    <p className="mt-1 text-sm text-fd-muted-foreground">
                                        Contribute, report issues, and submit
                                        pull requests.
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1 text-sm text-fd-muted-foreground group-hover:text-fd-foreground transition-colors">
                                    View on GitHub{" "}
                                    <ArrowRight className="h-3 w-3" />
                                </span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t py-8">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/magma-icon.png"
                            alt="Magma Logo"
                            width={24}
                            height={24}
                        />
                        <span className="font-semibold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                            Magma
                        </span>
                    </div>
                    <p className="text-sm text-fd-muted-foreground">
                        &copy; 2019-{new Date().getFullYear()} Magma. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
