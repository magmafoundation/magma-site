import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define schemas for validation
const DownloadTypeSchema = z.enum(["jar", "installer", "changelog"]);

const VersionParamsSchema = z.object({
  version: z.string().min(1),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ version: string }> }
) {
  const versionParams = await context.params;
  try {
    // Validate the version parameter
    const paramsResult = VersionParamsSchema.safeParse(versionParams);

    if (!paramsResult.success) {
      return NextResponse.json(
        {
          error: "Invalid version parameter",
          details: paramsResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { version } = paramsResult.data;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "installer"; // Default to installer

    // Validate download type
    const typeResult = DownloadTypeSchema.safeParse(type);

    if (!typeResult.success) {
      return NextResponse.json(
        {
          error:
            "Invalid type parameter. Must be one of: jar, installer, changelog",
          details: typeResult.error.format(),
        },
        { status: 400 }
      );
    }

    const baseUrl = `https://repo.magmafoundation.org/releases/org/magmafoundation/magma/${version}/magma-${version}`;
    let redirectUrl = "";

    // Get validated download type
    const downloadType = typeResult.data;

    // Determine which file to redirect to based on the type
    if (downloadType === "jar") {
      redirectUrl = `${baseUrl}.jar`;
    } else if (downloadType === "installer") {
      redirectUrl = `${baseUrl}-installer.jar`;
    } else if (downloadType === "changelog") {
      redirectUrl = `${baseUrl}-changelog.txt`;
    }

    // Check if the file exists with caching
    const fileExistsCheckRequest = new Request(redirectUrl, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MagmaNeoWebsite/1.0)",
      },
    });

    const fileExistsResponse = await fetch(fileExistsCheckRequest, {
      next: { revalidate: 3600 }, // Cache existence check for 1 hour
    });

    const fileExists = fileExistsResponse.ok;

    if (!fileExists) {
      // If installer doesn't exist but type is installer, try to fall back to jar
      if (downloadType === "installer") {
        const jarUrl = `${baseUrl}.jar`;
        const jarCheckRequest = new Request(jarUrl, {
          method: "HEAD",
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; MagmaNeoWebsite/1.0)",
          },
        });

        const jarCheckResponse = await fetch(jarCheckRequest, {
          next: { revalidate: 3600 }, // Cache existence check for 1 hour
        });

        const jarExists = jarCheckResponse.ok;

        if (jarExists) {
          // If jar exists, redirect to it instead
          redirectUrl = jarUrl;
        } else {
          // Neither installer nor jar exists
          return NextResponse.json(
            { error: `No download available for version ${version}` },
            { status: 404 }
          );
        }
      } else {
        // The requested file type doesn't exist
        return NextResponse.json(
          { error: `${downloadType} file not found for version ${version}` },
          { status: 404 }
        );
      }
    }

    // Track download analytics if needed
    // ...

    // Redirect to the download URL with cache control headers
    return NextResponse.redirect(redirectUrl, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error(`Error in download API for ${versionParams.version}:`, error);
    return NextResponse.json(
      { error: "Failed to process download request" },
      { status: 500 }
    );
  }
}
