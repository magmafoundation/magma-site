"use client";

import { useEffect, useState } from "react";

interface MavenArtifact {
    groupId: string;
    artifactId: string;
    version: string;
    minecraftVersion?: string;
    lastUpdated?: string;
    downloadUrl?: string;
    installerUrl?: string;
    launcherUrl?: string;
    changelogUrl?: string;
    isStable?: boolean;
    fileSize?: string;
    releaseDate?: string;
    hasInstaller?: boolean;
    hasLauncher?: boolean;
    hasChangelog?: boolean;
}

interface VersionsByMinecraft {
    [key: string]: MavenArtifact[];
}

function getMinecraftVersion(version: string): string {
    const match = version.match(/^(\d+)\.(\d+)/);
    if (!match) return "Unknown";

    const major = parseInt(match[1], 10);
    const minor = match[2];

    // Year-based MC versioning (26.0, 26.1, ...)
    if (major >= 26) return `${major}.${minor}`;

    // Legacy MC versioning (1.21.x, 1.20.x, ...)
    return `1.${major}.x`;
}

export function VersionList() {
    const [versions, setVersions] = useState<MavenArtifact[]>([]);
    const [versionsByMinecraft, setVersionsByMinecraft] =
        useState<VersionsByMinecraft>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [stabilityFilter, setStabilityFilter] = useState<
        "all" | "stable" | "beta"
    >("all");
    const [limit, setLimit] = useState<number>(10);
    const [totalVersions, setTotalVersions] = useState<number>(0);

    useEffect(() => {
        async function fetchVersions() {
            try {
                setLoading(true);
                const response = await fetch(`/api/versions?limit=${limit}`);
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch versions: ${response.status}`,
                    );
                }
                const data = await response.json();
                const { total, versions: fetchedVersions } = data;
                setTotalVersions(total);
                setVersions(fetchedVersions);

                const byMinecraft: VersionsByMinecraft = {};
                fetchedVersions.forEach((artifact: MavenArtifact) => {
                    const mcVersion =
                        artifact.minecraftVersion ||
                        getMinecraftVersion(artifact.version);
                    if (!byMinecraft[mcVersion]) {
                        byMinecraft[mcVersion] = [];
                    }
                    byMinecraft[mcVersion].push(artifact);
                });

                setVersionsByMinecraft(byMinecraft);

                if (Object.keys(byMinecraft).length > 0) {
                    setActiveTab(Object.keys(byMinecraft)[0]);
                }
            } catch (err) {
                console.error("Error fetching versions:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch versions",
                );
            } finally {
                setLoading(false);
            }
        }

        fetchVersions();
    }, [limit]);

    const applyStabilityFilter = (
        versions: MavenArtifact[],
    ): MavenArtifact[] => {
        if (stabilityFilter === "all") return versions;
        return versions.filter((artifact) => {
            if (stabilityFilter === "stable") return artifact.isStable === true;
            if (stabilityFilter === "beta") return artifact.isStable === false;
            return true;
        });
    };

    const getBuildVersion = (version: string): string => {
        const parts = version.split(".");
        if (parts.length >= 3) return parts.slice(1).join(".");
        return version;
    };

    if (loading) {
        return (
            <div className="rounded-xl border bg-fd-card p-8 text-center">
                <p className="text-sm text-fd-muted-foreground">
                    Loading versions...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border bg-fd-card p-8 text-center">
                <p className="text-sm text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (versions.length === 0) {
        return (
            <div className="rounded-xl border bg-fd-card p-8 text-center">
                <p className="text-sm text-fd-muted-foreground">
                    No versions available.{" "}
                    <a
                        href="https://repo.magmafoundation.org/#/releases/org/magmafoundation/magma"
                        className="text-fd-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Visit repository directly
                    </a>
                </p>
            </div>
        );
    }

    const mcVersions = Object.keys(versionsByMinecraft).sort((a, b) =>
        b.localeCompare(a, undefined, { numeric: true }),
    );

    const currentVersions =
        activeTab === "all"
            ? applyStabilityFilter(versions)
            : applyStabilityFilter(versionsByMinecraft[activeTab] || []);

    return (
        <div className="rounded-xl border bg-fd-card overflow-hidden">
            {/* Toolbar */}
            <div className="border-b p-4 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                    {mcVersions.map((mcVersion) => (
                        <button
                            type="button"
                            key={mcVersion}
                            onClick={() => setActiveTab(mcVersion)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                activeTab === mcVersion
                                    ? "bg-fd-primary text-fd-primary-foreground"
                                    : "bg-fd-muted text-fd-muted-foreground hover:text-fd-foreground"
                            }`}
                        >
                            {mcVersion}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => setActiveTab("all")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            activeTab === "all"
                                ? "bg-fd-primary text-fd-primary-foreground"
                                : "bg-fd-muted text-fd-muted-foreground hover:text-fd-foreground"
                        }`}
                    >
                        All
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        {(["all", "stable", "beta"] as const).map((filter) => (
                            <button
                                type="button"
                                key={filter}
                                onClick={() => setStabilityFilter(filter)}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                                    stabilityFilter === filter
                                        ? "bg-fd-primary text-fd-primary-foreground"
                                        : "text-fd-muted-foreground hover:text-fd-foreground"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="rounded-lg border bg-fd-background px-2 py-1.5 text-xs"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={0}>All</option>
                    </select>
                </div>
            </div>

            {/* Description */}
            {totalVersions > 0 && totalVersions > versions.length && (
                <div className="border-b px-4 py-2 text-xs text-fd-muted-foreground">
                    Showing {versions.length} of {totalVersions} versions
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-left text-xs text-fd-muted-foreground">
                            {activeTab === "all" && (
                                <th className="px-4 py-3 font-medium">
                                    Minecraft
                                </th>
                            )}
                            <th className="px-4 py-3 font-medium">Version</th>
                            <th className="px-4 py-3 font-medium">Build</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium text-right">
                                Downloads
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVersions.map((artifact) => (
                            <tr
                                key={artifact.version}
                                className="border-b last:border-b-0 hover:bg-fd-accent/30 transition-colors"
                            >
                                {activeTab === "all" && (
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs">
                                            {artifact.minecraftVersion ||
                                                getMinecraftVersion(
                                                    artifact.version,
                                                )}
                                        </span>
                                    </td>
                                )}
                                <td className="px-4 py-3 font-mono text-xs">
                                    {artifact.version}
                                </td>
                                <td className="px-4 py-3 font-mono text-xs text-fd-muted-foreground">
                                    {getBuildVersion(artifact.version)}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                            artifact.isStable
                                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                                : "bg-fd-muted text-fd-muted-foreground"
                                        }`}
                                    >
                                        {artifact.isStable ? "Stable" : "Beta"}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1.5 justify-end">
                                        {artifact.launcherUrl &&
                                            artifact.hasLauncher && (
                                                <a
                                                    href={`/api/versions/${artifact.version}/download?type=launcher`}
                                                    className="inline-flex h-7 items-center rounded-md bg-gradient-to-r from-orange-500 to-red-500 px-2.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
                                                >
                                                    Launcher
                                                </a>
                                            )}
                                        {artifact.installerUrl && (
                                            <a
                                                href={`/api/versions/${artifact.version}/download?type=installer`}
                                                className={`inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-medium transition-colors hover:bg-fd-accent ${
                                                    !artifact.hasLauncher
                                                        ? "bg-fd-primary text-fd-primary-foreground border-transparent hover:opacity-90"
                                                        : ""
                                                }`}
                                            >
                                                Installer
                                            </a>
                                        )}
                                        {artifact.changelogUrl && (
                                            <a
                                                href={`/api/versions/${artifact.version}/download?type=changelog`}
                                                className="inline-flex h-7 items-center rounded-md border px-2.5 text-xs transition-colors hover:bg-fd-accent"
                                            >
                                                Changelog
                                            </a>
                                        )}
                                        {!artifact.installerUrl &&
                                            (!artifact.launcherUrl ||
                                                !artifact.hasLauncher) && (
                                                <span className="text-xs text-fd-muted-foreground">
                                                    Not available
                                                </span>
                                            )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
