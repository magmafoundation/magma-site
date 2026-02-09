import { afterEach, describe, expect, it, vi } from "vitest";
import {
    checkFileExists,
    extractMinecraftVersion,
    fetchVersionDetails,
    fetchVersions,
    getDownloadUrl,
    hasLauncherSupport,
} from "./maven";

// ─── Pure functions ──────────────────────────────────────────────

describe("extractMinecraftVersion", () => {
    it("maps legacy versions to 1.X.x format", () => {
        expect(extractMinecraftVersion("21.1.67-beta")).toBe("1.21.x");
        expect(extractMinecraftVersion("21.1.41-beta")).toBe("1.21.x");
        expect(extractMinecraftVersion("21.0.1")).toBe("1.21.x");
        expect(extractMinecraftVersion("20.4.5-beta")).toBe("1.20.x");
        expect(extractMinecraftVersion("19.2.3")).toBe("1.19.x");
    });

    it("maps year-based versions to major.minor format", () => {
        expect(extractMinecraftVersion("26.0.5-beta")).toBe("26.0");
        expect(extractMinecraftVersion("26.1.3-beta")).toBe("26.1");
        expect(extractMinecraftVersion("27.0.1")).toBe("27.0");
        expect(extractMinecraftVersion("30.2.10-alpha")).toBe("30.2");
    });

    it("returns Unknown for unrecognised formats", () => {
        expect(extractMinecraftVersion("unknown")).toBe("Unknown");
        expect(extractMinecraftVersion("abc-def")).toBe("Unknown");
    });
});

describe("hasLauncherSupport", () => {
    it("returns true for versions >= 21.1.41", () => {
        expect(hasLauncherSupport("21.1.41-beta")).toBe(true);
        expect(hasLauncherSupport("21.1.67-beta")).toBe(true);
        expect(hasLauncherSupport("21.1.100-beta")).toBe(true);
    });

    it("returns false for versions < 21.1.41", () => {
        expect(hasLauncherSupport("21.1.40-beta")).toBe(false);
        expect(hasLauncherSupport("21.1.1-beta")).toBe(false);
        expect(hasLauncherSupport("21.1.0-beta")).toBe(false);
    });

    it("returns true for non-21.1.x versions", () => {
        expect(hasLauncherSupport("1.20.4-0.1.0")).toBe(true);
        expect(hasLauncherSupport("1.19.2")).toBe(true);
    });

    it("returns true for year-based versions", () => {
        expect(hasLauncherSupport("26.0.5-beta")).toBe(true);
        expect(hasLauncherSupport("26.1.3-beta")).toBe(true);
        expect(hasLauncherSupport("27.0.1")).toBe(true);
    });
});

describe("getDownloadUrl", () => {
    const v = "21.1.67-beta";
    const base =
        "https://repo.magmafoundation.org/releases/org/magmafoundation/magma/21.1.67-beta/magma-21.1.67-beta";

    it("builds jar URL", () => {
        expect(getDownloadUrl(v, "jar")).toBe(`${base}.jar`);
    });

    it("builds installer URL", () => {
        expect(getDownloadUrl(v, "installer")).toBe(`${base}-installer.jar`);
    });

    it("builds launcher URL", () => {
        expect(getDownloadUrl(v, "launcher")).toBe(`${base}-launcher.jar`);
    });

    it("builds changelog URL", () => {
        expect(getDownloadUrl(v, "changelog")).toBe(`${base}-changelog.txt`);
    });
});

// ─── Async functions (mocked fetch) ─────────────────────────────

afterEach(() => {
    vi.restoreAllMocks();
});

describe("checkFileExists", () => {
    it("returns true when HEAD is ok", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(null, { status: 200 }),
        );
        expect(await checkFileExists("https://example.com/file.jar")).toBe(
            true,
        );
    });

    it("returns false when HEAD is 404", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(null, { status: 404 }),
        );
        expect(await checkFileExists("https://example.com/file.jar")).toBe(
            false,
        );
    });

    it("returns false when fetch throws", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(
            new Error("network error"),
        );
        expect(await checkFileExists("https://example.com/file.jar")).toBe(
            false,
        );
    });
});

describe("fetchVersions", () => {
    const xmlResponse = `<?xml version="1.0"?>
<metadata>
  <versioning>
    <versions>
      <version>21.1.67-beta</version>
      <version>21.1.40-beta</version>
      <version>21.1.41-beta</version>
    </versions>
  </versioning>
</metadata>`;

    it("parses XML and returns sorted artifacts", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(xmlResponse, { status: 200 }),
        );

        const result = await fetchVersions(10);

        expect(result.total).toBe(3);
        expect(result.versions).toHaveLength(3);
        // Sorted descending
        expect(result.versions[0].version).toBe("21.1.67-beta");
        expect(result.versions[1].version).toBe("21.1.41-beta");
        expect(result.versions[2].version).toBe("21.1.40-beta");
    });

    it("respects limit parameter", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(xmlResponse, { status: 200 }),
        );

        const result = await fetchVersions(2);
        expect(result.total).toBe(3);
        expect(result.versions).toHaveLength(2);
    });

    it("returns all when limit is 0", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(xmlResponse, { status: 200 }),
        );

        const result = await fetchVersions(0);
        expect(result.total).toBe(3);
        expect(result.versions).toHaveLength(3);
    });

    it("builds correct artifact shape", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(xmlResponse, { status: 200 }),
        );

        const { versions } = await fetchVersions(1);
        const artifact = versions[0];

        expect(artifact.groupId).toBe("org.magmafoundation");
        expect(artifact.artifactId).toBe("magma");
        expect(artifact.version).toBe("21.1.67-beta");
        expect(artifact.minecraftVersion).toBe("1.21.x");
        expect(artifact.isStable).toBe(false);
        expect(artifact.hasLauncher).toBe(true);
        expect(artifact.hasInstaller).toBe(true);
        expect(artifact.installerUrl).toContain("installer.jar");
        expect(artifact.launcherUrl).toContain("launcher.jar");
        expect(artifact.changelogUrl).toContain("changelog.txt");
    });

    it("falls back to directory listing when XML fails", async () => {
        const dirHtml = `<html><body>
      <a href="../">../</a>
      <a href="21.1.67-beta/">21.1.67-beta/</a>
      <a href="21.1.41-beta/">21.1.41-beta/</a>
    </body></html>`;

        vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(new Response(null, { status: 404 })) // XML fails
            .mockResolvedValueOnce(new Response(dirHtml, { status: 200 })); // Dir listing

        const result = await fetchVersions(10);
        expect(result.total).toBe(2);
        expect(result.versions[0].version).toBe("21.1.67-beta");
    });

    it("returns empty on total failure", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(
            new Error("network error"),
        );

        const result = await fetchVersions(10);
        expect(result.total).toBe(0);
        expect(result.versions).toHaveLength(0);
    });
});

describe("fetchVersionDetails", () => {
    it("returns artifact with file checks", async () => {
        const metadataXml = `<?xml version="1.0"?>
<metadata><lastUpdated>20250101120000</lastUpdated></metadata>`;

        vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
            const url =
                typeof input === "string"
                    ? input
                    : input instanceof URL
                        ? input.toString()
                        : input.url;

            // installer HEAD check — exists
            if (url.includes("-installer.jar")) {
                return new Response(null, {
                    status: 200,
                    headers: { "content-length": "5242880" },
                });
            }
            // changelog HEAD check — exists
            if (url.includes("-changelog.txt")) {
                return new Response(null, { status: 200 });
            }
            // maven-metadata.xml for release date
            if (url.includes("maven-metadata.xml")) {
                return new Response(metadataXml, { status: 200 });
            }
            return new Response(null, { status: 404 });
        });

        const details = await fetchVersionDetails("21.1.67-beta");

        expect(details).not.toBeNull();
        expect(details!.version).toBe("21.1.67-beta");
        expect(details!.hasInstaller).toBe(true);
        expect(details!.hasChangelog).toBe(true);
        expect(details!.installerUrl).toBeDefined();
        expect(details!.changelogUrl).toBeDefined();
        expect(details!.fileSize).toBe("5.00 MB");
        expect(details!.releaseDate).toBe("2025-01-01");
    });

    it("clears URLs when files do not exist", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(null, { status: 404 }),
        );

        const details = await fetchVersionDetails("21.1.67-beta");

        expect(details).not.toBeNull();
        expect(details!.hasInstaller).toBe(false);
        expect(details!.hasChangelog).toBe(false);
        expect(details!.installerUrl).toBeUndefined();
        expect(details!.changelogUrl).toBeUndefined();
    });

    it("degrades gracefully when fetch throws", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(
            new Error("network error"),
        );

        const details = await fetchVersionDetails("21.1.67-beta");

        // Internal helpers catch their own errors, so we still get an artifact
        expect(details).not.toBeNull();
        expect(details!.hasInstaller).toBe(false);
        expect(details!.hasChangelog).toBe(false);
        expect(details!.fileSize).toBeUndefined();
        expect(details!.releaseDate).toBeUndefined();
    });
});
