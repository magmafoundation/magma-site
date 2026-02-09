import * as cheerio from "cheerio";

const MAVEN_BASE =
    "https://repo.magmafoundation.org/releases/org/magmafoundation/magma";
const USER_AGENT = "MagmaWebsite/1.0";

export type DownloadType = "jar" | "installer" | "launcher" | "changelog";

export interface MavenArtifact {
    groupId: string;
    artifactId: string;
    version: string;
    minecraftVersion: string;
    installerUrl?: string;
    launcherUrl?: string;
    changelogUrl?: string;
    isStable?: boolean;
    hasLauncher?: boolean;
    hasInstaller?: boolean;
    hasChangelog?: boolean;
    fileSize?: string;
    releaseDate?: string;
}

export function extractMinecraftVersion(version: string): string {
    // Magma versions follow {major}.{minor}.{build}-{tag}
    const match = version.match(/^(\d+)\.(\d+)/);
    if (!match) return "Unknown";

    const major = parseInt(match[1], 10);
    const minor = match[2];

    // Year-based MC versioning (26.0, 26.1, ...)
    if (major >= 26) return `${major}.${minor}`;

    // Legacy MC versioning (1.21.x, 1.20.x, ...)
    return `1.${major}.x`;
}

export function hasLauncherSupport(version: string): boolean {
    const match = version.match(/^21\.1\.(\d+)-/);
    if (match) return parseInt(match[1], 10) >= 41;
    return true;
}

export function getDownloadUrl(version: string, type: DownloadType): string {
    const base = `${MAVEN_BASE}/${version}/magma-${version}`;
    switch (type) {
        case "jar":
            return `${base}.jar`;
        case "installer":
            return `${base}-installer.jar`;
        case "launcher":
            return `${base}-launcher.jar`;
        case "changelog":
            return `${base}-changelog.txt`;
    }
}

export async function checkFileExists(url: string): Promise<boolean> {
    try {
        const res = await fetch(url, {
            method: "HEAD",
            headers: { "User-Agent": USER_AGENT },
        });
        return res.ok;
    } catch {
        return false;
    }
}

async function getFileSize(url: string): Promise<string | undefined> {
    try {
        const res = await fetch(url, {
            method: "HEAD",
            headers: { "User-Agent": USER_AGENT },
        });
        if (!res.ok) return undefined;
        const len = res.headers.get("content-length");
        if (!len) return undefined;
        const bytes = parseInt(len, 10);
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } catch {
        return undefined;
    }
}

async function getReleaseDate(version: string): Promise<string | undefined> {
    try {
        const res = await fetch(`${MAVEN_BASE}/${version}/maven-metadata.xml`, {
            headers: { "User-Agent": USER_AGENT },
        });
        if (!res.ok) return undefined;
        const $ = cheerio.load(await res.text(), { xmlMode: true });
        const ts = $("lastUpdated").text().trim();
        if (ts.length >= 8) {
            return `${ts.substring(0, 4)}-${ts.substring(4, 6)}-${ts.substring(6, 8)}`;
        }
        return undefined;
    } catch {
        return undefined;
    }
}

function buildArtifact(version: string): MavenArtifact {
    const launcher = hasLauncherSupport(version);
    return {
        groupId: "org.magmafoundation",
        artifactId: "magma",
        version,
        minecraftVersion: extractMinecraftVersion(version),
        installerUrl: getDownloadUrl(version, "installer"),
        launcherUrl: getDownloadUrl(version, "launcher"),
        changelogUrl: getDownloadUrl(version, "changelog"),
        isStable:
            !version.includes("beta") &&
            !version.includes("alpha") &&
            !version.includes("snapshot"),
        hasInstaller: true,
        hasLauncher: launcher,
    };
}

export async function fetchVersions(
    limit = 10,
): Promise<{ total: number; versions: MavenArtifact[] }> {
    try {
        const metadataUrl = `${MAVEN_BASE}/maven-metadata.xml`;
        const res = await fetch(metadataUrl, {
            headers: { "User-Agent": USER_AGENT },
            next: { revalidate: 3600 },
        });

        let artifacts: MavenArtifact[] = [];

        if (res.ok) {
            const $ = cheerio.load(await res.text(), { xmlMode: true });
            $("version").each((_, el) => {
                const v = $(el).text().trim();
                if (v) artifacts.push(buildArtifact(v));
            });
        }

        // Fallback: directory listing
        if (artifacts.length === 0) {
            const dirRes = await fetch(`${MAVEN_BASE}/`, {
                headers: { "User-Agent": USER_AGENT },
                next: { revalidate: 3600 },
            });
            if (dirRes.ok) {
                const $ = cheerio.load(await dirRes.text());
                $("a").each((_, el) => {
                    const href = $(el).attr("href");
                    if (
                        href?.endsWith("/") &&
                        !["../", "./"].includes(href) &&
                        !$(el).text().includes("maven-metadata")
                    ) {
                        artifacts.push(buildArtifact(href.replace("/", "")));
                    }
                });
            }
        }

        // Sort descending (latest first)
        artifacts.sort((a, b) =>
            b.version.localeCompare(a.version, undefined, {
                numeric: true,
                sensitivity: "base",
            }),
        );

        const total = artifacts.length;
        if (limit > 0) artifacts = artifacts.slice(0, limit);

        return { total, versions: artifacts };
    } catch (error) {
        console.error("Error fetching Maven versions:", error);
        return { total: 0, versions: [] };
    }
}

export async function fetchVersionDetails(
    version: string,
): Promise<MavenArtifact | null> {
    try {
        const artifact = buildArtifact(version);

        const [hasInstaller, hasChangelog] = await Promise.all([
            checkFileExists(getDownloadUrl(version, "installer")),
            checkFileExists(getDownloadUrl(version, "changelog")),
        ]);

        artifact.hasInstaller = hasInstaller;
        artifact.hasChangelog = hasChangelog;
        if (!hasInstaller) artifact.installerUrl = undefined;
        if (!hasChangelog) artifact.changelogUrl = undefined;
        if (!artifact.hasLauncher) artifact.launcherUrl = undefined;

        // Get file size from the primary download
        if (hasInstaller) {
            artifact.fileSize = await getFileSize(
                getDownloadUrl(version, "installer"),
            );
        } else {
            artifact.fileSize = await getFileSize(
                getDownloadUrl(version, "jar"),
            );
        }

        artifact.releaseDate = await getReleaseDate(version);

        return artifact;
    } catch (error) {
        console.error(`Error fetching details for version ${version}:`, error);
        return null;
    }
}
