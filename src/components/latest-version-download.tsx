"use client";

import { Download, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LatestVersion {
    version: string;
    minecraftVersion: string;
    installerUrl?: string;
    launcherUrl?: string;
    downloadUrl?: string;
    changelogUrl?: string;
    isStable: boolean;
    fileSize?: string;
    releaseDate?: string;
    hasInstaller?: boolean;
    hasLauncher?: boolean;
    hasChangelog?: boolean;
}

export function LatestVersionDownload() {
    const [latestVersion, setLatestVersion] = useState<LatestVersion | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLatestVersion() {
            try {
                setLoading(true);
                const { origin } = window.location;
                const response = await fetch(`${origin}/api/versions/latest`);

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch latest version: ${response.status}`,
                    );
                }

                const versionDetails = await response.json();
                setLatestVersion(versionDetails);
            } catch (err) {
                console.error("Error fetching latest version:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch latest version",
                );
            } finally {
                setLoading(false);
            }
        }

        fetchLatestVersion();
    }, []);

    if (loading) {
        return (
            <div className="rounded-xl border bg-fd-card p-6">
                <div className="text-center">
                    <p className="text-sm font-medium">Latest Version</p>
                    <p className="text-xs text-fd-muted-foreground mt-1">
                        Loading...
                    </p>
                </div>
                <div className="mt-6 animate-pulse space-y-3">
                    <div className="h-5 bg-fd-muted rounded w-2/3 mx-auto" />
                    <div className="h-10 bg-fd-muted rounded" />
                    <div className="h-8 bg-fd-muted rounded w-1/2 mx-auto" />
                </div>
            </div>
        );
    }

    if (error || !latestVersion) {
        return (
            <div className="rounded-xl border bg-fd-card p-6 text-center">
                <p className="font-medium">Latest Version</p>
                <p className="text-sm text-fd-muted-foreground mt-2">
                    Couldn&apos;t retrieve the latest version. Please check back
                    later or visit the repository directly.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                    <a
                        href="https://repo.magmafoundation.org/#/releases/org/magmafoundation/magma"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center rounded-lg border px-4 text-sm transition-colors hover:bg-fd-accent"
                    >
                        Browse Repository
                    </a>
                    <Link
                        href="/downloads"
                        className="inline-flex h-9 items-center rounded-lg bg-fd-primary px-4 text-sm text-fd-primary-foreground transition-opacity hover:opacity-90"
                    >
                        Go to Downloads
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-fd-card overflow-hidden">
            {/* Header */}
            <div className="border-b bg-gradient-to-r from-orange-500/5 to-red-500/5 p-6 text-center">
                <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-bold">
                        Magma {latestVersion.version}
                    </span>
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            latestVersion.isStable
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : "bg-fd-muted text-fd-muted-foreground"
                        }`}
                    >
                        {latestVersion.isStable ? "Stable" : "Beta"}
                    </span>
                </div>
                <p className="mt-1 text-sm text-fd-muted-foreground">
                    For Minecraft {latestVersion.minecraftVersion}
                    {latestVersion.fileSize && (
                        <> &middot; {latestVersion.fileSize}</>
                    )}
                    {latestVersion.releaseDate && (
                        <> &middot; {latestVersion.releaseDate}</>
                    )}
                </p>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-2">
                {latestVersion.hasLauncher || latestVersion.launcherUrl ? (
                    <Link
                        href="/api/versions/latest/download?type=launcher"
                        className="flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                        <Download className="h-4 w-4" />
                        Download Launcher
                    </Link>
                ) : null}

                {!latestVersion.installerUrl &&
                    (!latestVersion.hasLauncher ||
                        !latestVersion.launcherUrl) && (
                        <div className="flex h-10 items-center justify-center gap-2 rounded-lg bg-fd-muted text-sm text-fd-muted-foreground">
                            <Download className="h-4 w-4" />
                            Not Available
                        </div>
                    )}

                {(latestVersion.hasChangelog || latestVersion.changelogUrl) && (
                    <Link
                        href="/api/versions/latest/download?type=changelog"
                        className="flex h-9 items-center justify-center gap-2 rounded-lg border text-sm transition-colors hover:bg-fd-accent"
                    >
                        <FileText className="h-4 w-4" />
                        View Changelog
                    </Link>
                )}
            </div>

            {/* Footer */}
            <div className="border-t px-4 py-3 text-center">
                <Link
                    href="/downloads"
                    className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                >
                    View All Versions
                </Link>
            </div>
        </div>
    );
}
