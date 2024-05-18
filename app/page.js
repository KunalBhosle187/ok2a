import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiChatVoiceFill } from "@remixicon/react";
import { ModeToggle } from "@/components/toogle-mode";
import { GridBackgroundDemo } from "@/components/grid-background";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="flex py-3 px-5 border-b  justify-between items-center">
        <h5 className="flex gap-3 font-bold">
          <RiChatVoiceFill /> Ok2a
        </h5>
        <div className="flex gap-2">
          <Link href={"/signin"}>
            <Button>Login</Button>
          </Link>
          <ModeToggle />
        </div>
      </header>
      <GridBackgroundDemo />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg text-white px-3 py-1 text-sm bg-gray-800">
                  Performance
                </div>
                <h2 className="lg:leading-tighter dark:text-black text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] w-full">
                  Increase Productivity with AI AIDer
                </h2>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  href="#"
                >
                  Get Started
                </Link>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="inline-block rounded-lg text-white px-3 py-1 text-sm bg-gray-800">
                  Security
                </div>
                <p className="mx-auto max-w-[700px] text-black md:text-xl/relaxed">
                  AI AIDer is built with security in mind, ensuring that your
                  data is protected at all times. The platform integrates
                  seamlessly with your existing tools and is designed to enhance
                  collaboration and innovation across your organization.
                </p>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md border dark:text-white  border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                  href="#"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
        <div className="h-[30rem] w-full bg-green-400 bg-grid-white/[0.2] relative flex items-center justify-center">
          {/* Radial gradient for the container to give a faded look */}
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-green bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="flex flex-col text-center items-center space-y-3">
            <p className="text-3xl text-black  w-[70%] sm:text-7xl font-bold relative z-20 bg-clip-text  ">
              Experience the workflow the best frontend teams love.
            </p>
            <p className="text-2xl  w-[70%] sm:text-xl text-black  relative z-20 bg-clip-text ">
              Let your team focus on shipping features instead of managing
              infrastructure with automated CI/CD.{" "}
            </p>

            <form className="flex space-x-2">
              <Input
                className="max-w-lg flex-1"
                placeholder="Enter your email"
                type="email"
              />
              <Button type="submit">Sign Up</Button>
            </form>
            <p className="max-w-[700px] text-black md:text-xl/relaxed lg:text-base/relaxed xl:text-sm/relaxed dark:text-black">
              Sign up to get notified when we launch.
              <Link className="underline underline-offset-2" href="#">
                Terms & Conditions
              </Link>
            </p>
          </div>
        </div>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg dark:text-white bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Performance
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl w-full">
                  Traffic spikes should be exciting, not scary.
                </h2>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  href="#"
                >
                  Get Started
                </Link>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="inline-block rounded-lg dark:text-white bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Security
                </div>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                  Fully managed infrastructure designed to scale dynamically
                  with your traffic, a global edge to ensure your site is fast
                  for every customer, and the tools to monitor every aspect of
                  your app.
                </p>
                <Link
                  className="inline-flex dark:text-white h-9 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                  href="#"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Acenternity UI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
