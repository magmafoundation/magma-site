"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface MavenArtifact {
  groupId: string;
  artifactId: string;
  version: string;
  minecraftVersion?: string;
  lastUpdated?: string;
  downloadUrl?: string;
  installerUrl?: string;
  changelogUrl?: string;
  isStable?: boolean;
  fileSize?: string;
  releaseDate?: string;
  hasServerJar?: boolean;
  hasInstaller?: boolean;
  hasChangelog?: boolean;
}

interface VersionsByMinecraft {
  [key: string]: MavenArtifact[];
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
          throw new Error(`Failed to fetch versions: ${response.status}`);
        }
        const data = await response.json();

        // The API now returns { total, limit, versions }
        const { total, versions: fetchedVersions } = data;
        setTotalVersions(total);

        // Use versions directly without fetching detailed information
        setVersions(fetchedVersions);

        // Organize versions by Minecraft version
        const byMinecraft: VersionsByMinecraft = {};
        fetchedVersions.forEach((artifact: MavenArtifact) => {
          // Use server-provided minecraftVersion if available, otherwise calculate it
          const mcVersion =
            artifact.minecraftVersion || getMinecraftVersion(artifact.version);
          if (!byMinecraft[mcVersion]) {
            byMinecraft[mcVersion] = [];
          }
          byMinecraft[mcVersion].push(artifact);
        });

        setVersionsByMinecraft(byMinecraft);

        // Set the first Minecraft version as the active tab
        if (Object.keys(byMinecraft).length > 0) {
          setActiveTab(Object.keys(byMinecraft)[0]);
        }
      } catch (err) {
        console.error("Error fetching versions:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch versions"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchVersions();
  }, [limit]);

  // Filter versions based on stability setting
  const applyStabilityFilter = (versions: MavenArtifact[]): MavenArtifact[] => {
    if (stabilityFilter === "all") return versions;

    return versions.filter((artifact) => {
      if (stabilityFilter === "stable") {
        return artifact.isStable === true;
      } else if (stabilityFilter === "beta") {
        return artifact.isStable === false;
      }
      return true;
    });
  };

  // Extract minecraft versions from version strings (e.g., "21.1.33-beta" → "1.21.x")
  const getMinecraftVersion = (version: string): string => {
    // First attempt to detect Magma's version format for newer releases (e.g., "21.1.33-beta")
    if (version.startsWith("21.")) {
      return "1.21.x";
    } else if (version.includes("-")) {
      // Handle versions like "1.20.4-0.1.0" where Minecraft version is explicit
      const parts = version.split("-");
      if (parts.length > 0 && parts[0].match(/^\d+\.\d+(\.\d+)?$/)) {
        return parts[0];
      }
    }

    // Fallback to generic pattern extraction
    const match = version.match(/^(\d+\.\d+(?:\.\d+)?)/);
    return match ? match[1] : "Unknown";
  };

  // Extract build version (e.g., "21.1.33-beta" → "1.33-beta")
  const getBuildVersion = (version: string): string => {
    const parts = version.split(".");
    if (parts.length >= 3) {
      return parts.slice(1).join("."); // Remove the first part (MC version)
    }
    return version;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Magma Versions</CardTitle>
          <CardDescription>Loading available versions...</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center">
          Loading versions...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Magma Versions</CardTitle>
          <CardDescription>Error loading versions</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center text-destructive">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  if (versions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Magma Versions</CardTitle>
          <CardDescription>
            No versions available from repository
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <div className="space-y-4">
            <p>
              No versions could be fetched from the Maven repository at this
              time.
            </p>
            <p className="text-sm text-muted-foreground">
              Please check back later or visit the{" "}
              <a
                href="https://repo.magmafoundation.org/#/releases/org/magmafoundation/magma"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                repository directly
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const mcVersions = Object.keys(versionsByMinecraft).sort((a, b) => {
    // Sort Minecraft versions in descending order
    return b.localeCompare(a, undefined, { numeric: true });
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Magma Versions</CardTitle>
        <CardDescription>
          Available versions from the official Magma repository
          {totalVersions > 0 && totalVersions > versions.length && (
            <>
              {" "}
              - Showing {versions.length} of {totalVersions} versions
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Filter by stability:
            </p>
            <div className="flex gap-2">
              <Button
                variant={stabilityFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStabilityFilter("all")}
              >
                All Versions
              </Button>
              <Button
                variant={stabilityFilter === "stable" ? "default" : "outline"}
                size="sm"
                onClick={() => setStabilityFilter("stable")}
              >
                Stable Only
              </Button>
              <Button
                variant={stabilityFilter === "beta" ? "default" : "outline"}
                size="sm"
                onClick={() => setStabilityFilter("beta")}
              >
                Beta Only
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Show versions:</p>
            <div className="flex gap-2">
              <Button
                variant={limit === 10 ? "default" : "outline"}
                size="sm"
                onClick={() => setLimit(10)}
              >
                10
              </Button>
              <Button
                variant={limit === 20 ? "default" : "outline"}
                size="sm"
                onClick={() => setLimit(20)}
              >
                20
              </Button>
              <Button
                variant={limit === 50 ? "default" : "outline"}
                size="sm"
                onClick={() => setLimit(50)}
              >
                50
              </Button>
              <Button
                variant={limit === 0 ? "default" : "outline"}
                size="sm"
                onClick={() => setLimit(0)}
              >
                All
              </Button>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4 flex flex-wrap">
            {mcVersions.map((mcVersion) => (
              <TabsTrigger key={mcVersion} value={mcVersion}>
                {mcVersion}
              </TabsTrigger>
            ))}
            <TabsTrigger value="all">All Versions</TabsTrigger>
          </TabsList>

          {mcVersions.map((mcVersion) => (
            <TabsContent key={mcVersion} value={mcVersion} className="w-full">
              <VersionTable
                versions={applyStabilityFilter(versionsByMinecraft[mcVersion])}
                showMinecraftVersion={false}
                getBuildVersion={getBuildVersion}
              />
            </TabsContent>
          ))}

          <TabsContent value="all" className="w-full">
            <VersionTable
              versions={applyStabilityFilter(versions)}
              showMinecraftVersion={true}
              getMinecraftVersion={getMinecraftVersion}
              getBuildVersion={getBuildVersion}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface VersionTableProps {
  versions: MavenArtifact[];
  showMinecraftVersion: boolean;
  getMinecraftVersion?: (version: string) => string;
  getBuildVersion: (version: string) => string;
}

function VersionTable({
  versions,
  showMinecraftVersion,
  getMinecraftVersion,
  getBuildVersion,
}: VersionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showMinecraftVersion && <TableHead>Minecraft</TableHead>}
          <TableHead>Version</TableHead>
          <TableHead>Build</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Download Options</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {versions.map((artifact) => (
          <TableRow key={artifact.version}>
            {showMinecraftVersion && (
              <TableCell>
                <Badge variant="outline">
                  {artifact.minecraftVersion ||
                    getMinecraftVersion?.(artifact.version) ||
                    "Unknown"}
                </Badge>
              </TableCell>
            )}
            <TableCell>{artifact.version}</TableCell>
            <TableCell>{getBuildVersion(artifact.version)}</TableCell>
            <TableCell>
              {artifact.isStable ? (
                <Badge
                  variant="default"
                  className="bg-green-500 hover:bg-green-600"
                >
                  Stable
                </Badge>
              ) : (
                <Badge variant="secondary">Beta</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex flex-wrap gap-2 justify-end">
                {artifact.installerUrl && (
                  <Button size="sm" asChild>
                    <a
                      href={`/api/versions/${artifact.version}/download?type=installer`}
                      title="Download Installer"
                    >
                      Installer
                    </a>
                  </Button>
                )}
                {artifact.downloadUrl && !artifact.installerUrl && (
                  <Button size="sm" asChild>
                    <a
                      href={`/api/versions/${artifact.version}/download?type=jar`}
                      title="Download JAR"
                    >
                      Server JAR
                    </a>
                  </Button>
                )}
                {artifact.changelogUrl && (
                  <Button size="sm" variant="secondary" asChild>
                    <a
                      href={`/api/versions/${artifact.version}/download?type=changelog`}
                      title="View Changelog"
                    >
                      Changelog
                    </a>
                  </Button>
                )}
                {!artifact.installerUrl && !artifact.downloadUrl && (
                  <span className="text-muted-foreground">Not available</span>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
