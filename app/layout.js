import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import { Providers } from "@/components/providers";

const meta = {
  title: "AI RSC Demo",
  description:
    "Demo of an interactive financial assistant built using Next.js and Vercel AI SDK.",
};
export const metadata = {
  ...meta,
  title: {
    default: "AI RSC Demo",
    template: `%s - AI RSC Demo`,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  twitter: {
    ...meta,
    card: "summary_large_image",
    site: "@vercel",
  },
  openGraph: {
    ...meta,
    locale: "en-US",
    type: "website",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <Toaster />
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
