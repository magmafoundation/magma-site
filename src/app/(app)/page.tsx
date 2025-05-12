import Link from "next/link";
import Image from "next/image";
import {
  Server,
  Puzzle,
  Zap,
  Code,
  ChevronRight,
  Users,
  BookOpen,
  Cpu,
  Download,
} from "lucide-react";
import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-8 md:py-16 lg:py-24 xl:py-32 bg-linear-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                    Run <span className="text-orange-500">NeoForge Mods</span>{" "}
                    and <span className="text-red-500">Bukkit Plugins</span>{" "}
                    Together
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">
                    Magma is the ultimate Minecraft server software that
                    combines the power of NeoForge mods and Bukkit plugins in
                    one seamless experience.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    <Link href="#download">
                      Get Started <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/docs">Documentation</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center mt-8 lg:mt-0">
                <div className="relative w-full aspect-square md:aspect-video lg:aspect-square overflow-hidden rounded-lg border bg-linear-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-4 md:p-6 shadow-xl">
                  <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 to-red-500/10 rounded-lg"></div>

                  {/* Server Icon in Center */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-linear-to-br from-orange-500 to-red-500 rounded-full shadow-lg">
                      <Server className="w-8 h-8 md:w-12 md:h-12 text-white" />
                      <div className="absolute -inset-1 bg-linear-to-br from-orange-500/50 to-red-500/50 rounded-full blur-xs -z-10"></div>
                    </div>
                  </div>

                  {/* Orbiting Icons */}
                  <div className="absolute top-[15%] left-[15%] animate-pulse">
                    <div className="flex items-center justify-center w-10 h-10 md:w-16 md:h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full shadow-md">
                      <Puzzle className="w-5 h-5 md:w-8 md:h-8 text-orange-500" />
                    </div>
                  </div>

                  <div className="absolute top-[15%] right-[15%] animate-pulse delay-300">
                    <div className="flex items-center justify-center w-10 h-10 md:w-16 md:h-16 bg-red-100 dark:bg-red-900/30 rounded-full shadow-md">
                      <Code className="w-5 h-5 md:w-8 md:h-8 text-red-500" />
                    </div>
                  </div>

                  <div className="absolute bottom-[15%] left-[15%] animate-pulse delay-700">
                    <div className="flex items-center justify-center w-10 h-10 md:w-16 md:h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full shadow-md">
                      <Cpu className="w-5 h-5 md:w-8 md:h-8 text-amber-500" />
                    </div>
                  </div>

                  <div className="absolute bottom-[15%] right-[15%] animate-pulse delay-500">
                    <div className="flex items-center justify-center w-10 h-10 md:w-16 md:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full shadow-md">
                      <Users className="w-5 h-5 md:w-8 md:h-8 text-blue-500" />
                    </div>
                  </div>

                  {/* Connecting Lines with Animation */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* NeoForge Line */}
                    <line
                      x1="50%"
                      y1="50%"
                      x2="15%"
                      y2="15%"
                      stroke="url(#orange-gradient)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="40"
                        to="0"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </line>

                    {/* Bukkit Line */}
                    <line
                      x1="50%"
                      y1="50%"
                      x2="85%"
                      y2="15%"
                      stroke="url(#red-gradient)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="40"
                        to="0"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </line>

                    {/* Performance Line */}
                    <line
                      x1="50%"
                      y1="50%"
                      x2="15%"
                      y2="85%"
                      stroke="url(#amber-gradient)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="40"
                        to="0"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </line>

                    {/* Community Line */}
                    <line
                      x1="50%"
                      y1="50%"
                      x2="85%"
                      y2="85%"
                      stroke="url(#blue-gradient)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="40"
                        to="0"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </line>

                    <defs>
                      <linearGradient
                        id="orange-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="rgba(249, 115, 22, 0.5)" />
                        <stop
                          offset="100%"
                          stopColor="rgba(249, 115, 22, 0.1)"
                        />
                      </linearGradient>
                      <linearGradient
                        id="red-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="rgba(239, 68, 68, 0.5)" />
                        <stop
                          offset="100%"
                          stopColor="rgba(239, 68, 68, 0.1)"
                        />
                      </linearGradient>
                      <linearGradient
                        id="amber-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="rgba(245, 158, 11, 0.5)" />
                        <stop
                          offset="100%"
                          stopColor="rgba(245, 158, 11, 0.1)"
                        />
                      </linearGradient>
                      <linearGradient
                        id="blue-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
                        <stop
                          offset="100%"
                          stopColor="rgba(59, 130, 246, 0.1)"
                        />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Labels */}
                  <div className="absolute top-[5%] left-[15%] text-[10px] md:text-xs font-medium text-orange-600 dark:text-orange-400">
                    NeoForge
                  </div>
                  <div className="absolute top-[5%] right-[15%] text-[10px] md:text-xs font-medium text-red-600 dark:text-red-400">
                    Bukkit
                  </div>
                  <div className="absolute bottom-[5%] left-[15%] text-[10px] md:text-xs font-medium text-amber-600 dark:text-amber-400">
                    Performance
                  </div>
                  <div className="absolute bottom-[5%] right-[15%] text-[10px] md:text-xs font-medium text-blue-600 dark:text-blue-400">
                    Community
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-10 md:py-16 lg:py-24 bg-background"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-500 dark:bg-orange-800/30 dark:text-orange-400">
                  Features
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl">
                  Why Choose Magma?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-lg lg:text-base xl:text-lg">
                  Magma combines the best of both worlds, allowing you to run
                  NeoForge mods and Bukkit plugins simultaneously on your
                  Minecraft server.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 md:py-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-4 md:p-6 shadow-xs">
                <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-800/30">
                  <Puzzle className="h-6 w-6 text-orange-500 dark:text-orange-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">
                  NeoForge Mods Support
                </h3>
                <p className="text-center text-sm md:text-base text-muted-foreground">
                  Run your favorite NeoForge mods to enhance gameplay and add
                  new content to your server.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-4 md:p-6 shadow-xs">
                <div className="rounded-full bg-red-100 p-3 dark:bg-red-800/30">
                  <Code className="h-6 w-6 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">
                  Bukkit Plugins Support
                </h3>
                <p className="text-center text-sm md:text-base text-muted-foreground">
                  Utilize powerful Bukkit plugins for server management,
                  protection, and administration.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-4 md:p-6 shadow-xs">
                <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-800/30">
                  <Zap className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">
                  Optimized Performance
                </h3>
                <p className="text-center text-sm md:text-base text-muted-foreground">
                  Enjoy improved server performance with our optimized codebase
                  and efficient resource usage.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-4 md:p-6 shadow-xs">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-800/30">
                  <Server className="h-6 w-6 text-green-500 dark:text-green-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">Easy Setup</h3>
                <p className="text-center text-sm md:text-base text-muted-foreground">
                  Get your server up and running quickly with our simple
                  installation process and configuration.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-4 md:p-6 shadow-xs">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-800/30">
                  <Users className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">
                  Active Community
                </h3>
                <p className="text-center text-sm md:text-base text-muted-foreground">
                  Join our growing community of server owners and developers for
                  support and collaboration.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-4 md:p-6 shadow-xs">
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-800/30">
                  <BookOpen className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">
                  Comprehensive Docs
                </h3>
                <p className="text-center text-sm md:text-base text-muted-foreground">
                  Access detailed documentation to help you make the most of
                  Magma&apos;s features.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="download"
          className="w-full py-10 md:py-16 lg:py-24 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-500 dark:bg-orange-800/30 dark:text-orange-400">
                  Download
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl">
                  Get Magma Today
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-lg lg:text-base xl:text-lg">
                  Download the latest version of Magma and start running
                  NeoForge mods and Bukkit plugins together.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 md:py-12 md:grid-cols-2">
              {/* <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-4 md:p-6 shadow-xs">
                <h3 className="text-lg md:text-xl font-bold">
                  Latest Stable Release
                </h3>
                <p className="text-center text-sm md:text-base text-muted-foreground">
                  Magma v1.2.0 for Minecraft 1.19.2
                </p>
                <div className="flex flex-col w-full gap-2 min-[400px]:flex-row">
                  <Button className="w-full md:w-auto bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                  <Button variant="outline" className="w-full md:w-auto">
                    View Changelog
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-4 md:p-6 shadow-xs">
                <h3 className="text-lg md:text-xl font-bold">
                  Development Build
                </h3>
                <p className="text-center text-sm md:text-base text-muted-foreground">
                  Magma Dev Build for Minecraft 1.20.1
                </p>
                <div className="flex flex-col w-full gap-2 min-[400px]:flex-row">
                  <Button variant="outline" className="w-full md:w-auto">
                    <Download className="mr-2 h-4 w-4" /> Download Dev Build
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full md:w-auto"
                  >
                    <Link href="https://github.com">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="mr-2 h-4 w-4"
                        fill="currentColor"
                      >
                        <path d={siGithub.path} />
                      </svg>
                    </Link>
                  </Button>
                </div>
              </div> */}
              <div className="flex flex-col items-center justify-center col-span-2 ">
                <span className="inline-block rounded-lg bg-orange-100 px-4 py-2 text-lg text-orange-500 dark:bg-orange-800/30 dark:text-orange-400 font-semibold">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="docs"
          className="w-full py-10 md:py-16 lg:py-24 bg-background"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex items-center justify-center order-2 lg:order-1">
                <div className="relative w-full aspect-video overflow-hidden rounded-lg border bg-background shadow-xl">
                  <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-red-500/5"></div>

                  {/* Documentation Preview */}
                  <div className="absolute inset-0 p-2 md:p-4 flex flex-col">
                    <div className="flex items-center gap-2 border-b pb-2 md:pb-3 mb-2 md:mb-3">
                      <div className="w-4 h-4 md:w-6 md:h-6 rounded-md bg-linear-to-r from-orange-500 to-red-500"></div>
                      <div className="text-base md:text-lg font-bold">
                        Magma Documentation
                      </div>
                    </div>

                    <div className="flex flex-1">
                      {/* Sidebar */}
                      <div className="w-1/4 border-r pr-1 md:pr-3 hidden sm:block">
                        <div className="mb-2 text-xs md:text-sm font-medium">
                          Getting Started
                        </div>
                        <div className="pl-2 text-[10px] md:text-xs text-orange-500 border-l-2 border-orange-500 mb-1">
                          Installation
                        </div>
                        <div className="pl-2 text-[10px] md:text-xs text-muted-foreground mb-1">
                          Configuration
                        </div>
                        <div className="pl-2 text-[10px] md:text-xs text-muted-foreground mb-3">
                          First Steps
                        </div>

                        <div className="mb-2 text-xs md:text-sm font-medium">
                          Guides
                        </div>
                        <div className="pl-2 text-[10px] md:text-xs text-muted-foreground mb-1">
                          Adding Mods
                        </div>
                        <div className="pl-2 text-[10px] md:text-xs text-muted-foreground mb-1">
                          Adding Plugins
                        </div>
                        <div className="pl-2 text-[10px] md:text-xs text-muted-foreground mb-3">
                          Optimization
                        </div>

                        <div className="mb-2 text-xs md:text-sm font-medium">
                          Reference
                        </div>
                        <div className="pl-2 text-[10px] md:text-xs text-muted-foreground mb-1">
                          Commands
                        </div>
                        <div className="pl-2   md:text-xs text-muted-foreground mb-1">
                          Commands
                        </div>
                        <div className="pl-2 text-[10px] md:text-xs text-muted-foreground mb-1">
                          API
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pl-2 md:pl-4">
                        <div className="text-base md:text-xl font-bold mb-2 md:mb-3">
                          Installation Guide
                        </div>
                        <div className="text-[10px] md:text-xs text-muted-foreground mb-2 md:mb-3">
                          Learn how to install Magma on your server
                        </div>

                        <div className="text-xs md:text-sm font-medium mb-1 md:mb-2">
                          Requirements
                        </div>
                        <div className="text-[10px] md:text-xs mb-2 md:mb-3">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
                            <span>Java 21 or newer</span>
                          </div>
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
                            <span>Minimum 4GB RAM</span>
                          </div>
                        </div>

                        <div className="text-xs md:text-sm font-medium mb-1 md:mb-2">
                          Download
                        </div>
                        <div className="bg-muted p-1 md:p-2 rounded text-[10px] md:text-xs font-mono mb-2 md:mb-3">
                          wget magmafoundation.org/downloads/magma.jar
                        </div>

                        <div className="text-xs md:text-sm font-medium mb-1 md:mb-2">
                          Starting the Server
                        </div>
                        <div className="bg-muted p-1 md:p-2 rounded text-[10px] md:text-xs font-mono">
                          java -Xmx4G -jar Magma-1.2.0.jar nogui
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 order-1 lg:order-2">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-500 dark:bg-orange-800/30 dark:text-orange-400">
                    Documentation
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl">
                    Comprehensive Documentation
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground text-sm md:text-base lg:text-lg">
                    Our detailed documentation covers everything from
                    installation to advanced configuration and troubleshooting.
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-orange-500 shrink-0" />
                    <span className="text-sm md:text-base">
                      Installation guides for different operating systems
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-orange-500 shrink-0" />
                    <span className="text-sm md:text-base">
                      Mod and plugin compatibility lists
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-orange-500 shrink-0" />
                    <span className="text-sm md:text-base">
                      Performance optimization tips
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-orange-500 shrink-0" />
                    <span className="text-sm md:text-base">
                      Troubleshooting common issues
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-orange-500 shrink-0" />
                    <span className="text-sm md:text-base">
                      API documentation for developers
                    </span>
                  </li>
                </ul>
                <div>
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    <Link href="/docs">Browse Documentation</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="community"
          className="w-full py-10 md:py-16 lg:py-24 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-500 dark:bg-orange-800/30 dark:text-orange-400">
                  Community
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl">
                  Join Our Community
                </h2>
                <p className="max-w-[900px] text-muted-foreground text-sm md:text-base lg:text-lg">
                  Connect with other Magma users, get support, and contribute to
                  the project.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 md:py-12 sm:grid-cols-2 md:grid-cols-2">
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-4 md:p-6 shadow-xs">
                <SiDiscord className="h-10 w-10 " />
                <h3 className="text-lg md:text-xl font-bold">Discord</h3>
                <p className="text-center text-sm md:text-base text-muted-foreground">
                  Join our Discord server to chat with other users and get
                  real-time support.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="https://discord.gg/magma">Join Discord</Link>
                </Button>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-4 md:p-6 shadow-xs">
                <SiGithub className="h-10 w-10 " />
                <h3 className="text-lg md:text-xl font-bold">GitHub</h3>
                <p className="text-center text-sm md:text-base text-muted-foreground">
                  Contribute to the project, report issues, and submit pull
                  requests on GitHub.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="https://github.com/magmafoundation/Magma-Neo">
                    View on GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6 md:py-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/magma-icon.png"
              alt="Magma Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-bold bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Magma
            </span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; 2019-{new Date().getFullYear()} Magma. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {/* May add links here */}
          </div>
        </div>
      </footer>
    </div>
  );
}
