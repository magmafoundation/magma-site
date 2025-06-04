import { VersionList } from "@/components/version-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InfoIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Downloads | Magma",
  description: "Download Magma server software for Minecraft",
};

export default function DownloadsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Downloads</h1>
          <p className="text-muted-foreground text-lg">
            Download the latest versions of Magma server software
          </p>
        </div>

        <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertTitle>Minecraft 1.21.1 Development Status</AlertTitle>
          <AlertDescription>
            <p className="mb-1">
              Please note that Magma for Minecraft 1.21.1 is currently in{" "}
              <strong>early development</strong> and may have the following
              issues:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Stability problems and unexpected crashes</li>
              <li>Incomplete mod and plugin compatibility</li>
              <li>Performance issues under heavy load</li>
              <li>Missing features compared to stable versions</li>
            </ul>
            <p className="mt-2 text-sm">
              For production servers, we recommend using our stable releases for
              earlier Minecraft versions.
            </p>
          </AlertDescription>
        </Alert>

        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle>Download Options</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Launcher JAR</strong> -{" "}
                <span className="text-orange-600 dark:text-orange-400">
                  Available for versions 1.40-beta and above
                </span>
                . This jar file (with the <code>-launcher.jar</code> suffix)
                includes built-in launcher functionality.
              </li>
              <li>
                <strong>Installer JAR</strong> - Used for all versions. This
                file helps set up your Magma server with a guided installation
                process.
              </li>
              <li>
                <strong>Changelog</strong> - View the changes and updates for
                each version.
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Official Repository</CardTitle>
              <CardDescription>
                Browse the official Maven repository
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Access all available builds directly from our Maven repository.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <a
                  href="https://repo.magmafoundation.org/#/releases/org/magmafoundation/magma"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Browse Repository
                </a>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Source Code</CardTitle>
              <CardDescription>Build from source</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Clone the repository and build Magma from source.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <a
                  href="https://github.com/magmafoundation/Magma-Neo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repository
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Version Information
          </h2>
          <p className="text-muted-foreground">
            The versions below are fetched directly from the official Magma
            Maven repository. They are organized by Minecraft version for easier
            navigation.
          </p>
        </div>

        <VersionList />

        <div className="space-y-4 mt-8 p-6 border rounded-lg bg-muted/20">
          <div className="flex items-start gap-2">
            <InfoIcon className="h-5 w-5 text-muted-foreground mt-1" />
            <div>
              <h3 className="text-lg font-semibold">
                Installation Instructions
              </h3>
              <p className="text-muted-foreground">
                After downloading your preferred version, you can find detailed
                installation instructions in our
                <Link
                  href="/docs/installation"
                  className="text-primary hover:underline ml-1"
                >
                  installation guide
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
