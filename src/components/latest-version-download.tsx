"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Download, FileText } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface LatestVersion {
  version: string;
  minecraftVersion: string;
  installerUrl?: string;
  downloadUrl?: string;
  changelogUrl?: string;
  isStable: boolean;
  fileSize?: string;
  releaseDate?: string;
  hasServerJar?: boolean;
  hasInstaller?: boolean;
  hasChangelog?: boolean;
}

export function LatestVersionDownload() {
  const [latestVersion, setLatestVersion] = useState<LatestVersion | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLatestVersion() {
      try {
        setLoading(true);

        // Use the new latest version API endpoint
        const response = await fetch("/api/versions/latest");

        if (!response.ok) {
          throw new Error(`Failed to fetch latest version: ${response.status}`);
        }

        // The latest endpoint already returns detailed information
        const versionDetails = await response.json();
        setLatestVersion(versionDetails);
      } catch (err) {
        console.error("Error fetching latest version:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch latest version"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchLatestVersion();
  }, []);

  if (loading) {
    return (
      <Card className="w-full md:max-w-md mx-auto shadow-md">
        <CardHeader className="text-center">
          <CardTitle>Latest Version</CardTitle>
          <CardDescription>Loading latest version...</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-6 bg-muted rounded w-2/3"></div>
            <div className="h-10 bg-muted rounded w-full mt-2"></div>
            <div className="h-8 bg-muted rounded w-1/2 mt-2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !latestVersion) {
    return (
      <Card className="w-full md:max-w-md mx-auto shadow-md">
        <CardHeader className="text-center">
          <CardTitle>Latest Version</CardTitle>
          <CardDescription>
            No versions are currently available from the repository.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          <p>
            We couldn&apos;t retrieve any versions from the Maven repository at
            this time.
          </p>
          <p className="mt-2">
            Please check back later or visit the repository directly.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link
              href="https://repo.magmafoundation.org/#/releases/org/magmafoundation/magma"
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse Repository
            </Link>
          </Button>
          <Button asChild>
            <Link href="/downloads">Go to Downloads</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full md:max-w-md mx-auto shadow-lg border-2 border-orange-100 dark:border-orange-900/30">
      <CardHeader className="text-center border-b pb-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-t-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CardTitle className="text-2xl">
            Magma {latestVersion.version}
          </CardTitle>
          {latestVersion.isStable ? (
            <Badge className="bg-green-500 hover:bg-green-600">Stable</Badge>
          ) : (
            <Badge variant="secondary">Beta</Badge>
          )}
        </div>
        <CardDescription className="text-base">
          For Minecraft {latestVersion.minecraftVersion}
          {latestVersion.fileSize && (
            <span className="block mt-1">Size: {latestVersion.fileSize}</span>
          )}
          {latestVersion.releaseDate && (
            <span className="block mt-1">
              Released: {latestVersion.releaseDate}
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex flex-col gap-3">
          {latestVersion.hasInstaller || latestVersion.installerUrl ? (
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              asChild
            >
              <Link
                href="/api/versions/latest/download?type=installer"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-5 w-5" /> Download Installer
              </Link>
            </Button>
          ) : latestVersion.hasServerJar || latestVersion.downloadUrl ? (
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              asChild
            >
              <Link
                href="/api/versions/latest/download?type=jar"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-5 w-5" /> Download Server JAR
              </Link>
            </Button>
          ) : (
            <Button size="lg" className="w-full" disabled>
              <Download className="mr-2 h-5 w-5" /> Not Available
            </Button>
          )}

          {(latestVersion.hasChangelog || latestVersion.changelogUrl) && (
            <Button size="sm" variant="outline" className="w-full" asChild>
              <Link
                href="/api/versions/latest/download?type=changelog"
                rel="noopener noreferrer"
              >
                <FileText className="mr-2 h-4 w-4" /> View Changelog
              </Link>
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-center border-t pt-4">
        <Button variant="link" asChild>
          <Link href="/downloads">View All Versions</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
