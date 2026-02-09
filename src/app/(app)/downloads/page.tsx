import { AlertCircle, ExternalLink, InfoIcon } from "lucide-react";
import Link from "next/link";
import { VersionList } from "@/components/version-list";
import { siteConfig } from "@/lib/config";

export const metadata = {
    title: "Downloads | Magma",
    description: "Download Magma server software for Minecraft",
};

export default function DownloadsPage() {
    return (
        <div className="container mx-auto max-w-5xl px-4 md:px-6 py-10">
            <div className="flex flex-col gap-10">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Downloads
                    </h1>
                    <p className="mt-2 text-fd-muted-foreground text-lg">
                        Download the latest versions of Magma server software.
                    </p>
                </div>

                {/* Notice */}
                {siteConfig.notification.enabled && (
                    <div className="flex gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                        <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-yellow-600 dark:text-yellow-400">
                                {siteConfig.notification.title}
                            </p>
                            <p className="mt-1 text-fd-muted-foreground">
                                {siteConfig.notification.message}
                            </p>
                        </div>
                    </div>
                )}

                {/* Quick Links */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <a
                        href="https://repo.magmafoundation.org/#/releases/org/magmafoundation/magma"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-xl border bg-fd-card p-4 transition-colors hover:bg-fd-accent/50"
                    >
                        <div>
                            <p className="font-medium">Maven Repository</p>
                            <p className="text-sm text-fd-muted-foreground">
                                Browse all builds directly
                            </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-fd-muted-foreground group-hover:text-fd-foreground transition-colors" />
                    </a>
                    <a
                        href="https://github.com/magmafoundation/Magma-Neo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-xl border bg-fd-card p-4 transition-colors hover:bg-fd-accent/50"
                    >
                        <div>
                            <p className="font-medium">Source Code</p>
                            <p className="text-sm text-fd-muted-foreground">
                                Clone and build from source
                            </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-fd-muted-foreground group-hover:text-fd-foreground transition-colors" />
                    </a>
                </div>

                {/* Version List */}
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        All Versions
                    </h2>
                    <p className="mt-1 text-sm text-fd-muted-foreground mb-6">
                        Fetched from the official Maven repository, organized by
                        Minecraft version.
                    </p>
                    <VersionList />
                </div>

                {/* Installation Link */}
                <div className="flex items-start gap-3 rounded-xl border bg-fd-card p-4">
                    <InfoIcon className="h-5 w-5 text-fd-muted-foreground mt-0.5 shrink-0" />
                    <div className="text-sm">
                        <p className="font-medium">Installation Instructions</p>
                        <p className="text-fd-muted-foreground">
                            After downloading, follow our{" "}
                            <Link
                                href="/docs/installation"
                                className="text-fd-primary hover:underline"
                            >
                                installation guide
                            </Link>{" "}
                            for detailed setup instructions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
