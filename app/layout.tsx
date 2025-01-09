import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "better-gist",
    template: "%s | better-gist",
  },
  description: "generate shareable snippet links quickly and effortlessly.",
  keywords: [
    "code snippets",
    "gist",
    "code sharing",
    "developer tools",
    "programming",
    "gist",
  ],
  authors: [{ name: "sanyam punia" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://better-gist.vercel.app/",
    siteName: "better-gist",
    title: "better-gist",
    description: "generate shareable snippet links quickly and effortlessly.",
    images: [
      {
        url: "https://better-gist.vercel.app/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "better-gist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "better-gist",
    description: "generate shareable snippet links quickly and effortlessly.",
    images: ["https://better-gist.vercel.app/opengraph-image.jpg"],
    creator: "@prodmxle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://better-gist.vercel.app/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
