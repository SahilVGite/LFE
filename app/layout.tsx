import type React from "react"
import type { Metadata } from "next"
import {
  Inter,
  Noto_Sans,
  Open_Sans,
  Outfit,
  Plus_Jakarta_Sans,
  Poppins,
  Roboto,
} from "next/font/google";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100","300","400","500","700","900"],
  variable: "--font-roboto",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
    title: "Legal Case AI - Find & Generate Legal Cases",
    description:
        "AI-powered legal case search and generation platform. Find relevant case law or generate case analysis with ChatGPT.",
    generator: "v0.app",
    icons: {
        icon: [
            {
                url: "/favicon_io/favicon-32x32.png",
                media: "(prefers-color-scheme: light)",
            },
            {
                url: "/favicon_io/favicon-32x32.png",
                media: "(prefers-color-scheme: dark)",
            },
            {
                url: "/favicon.ico",
                type: "image/svg+xml",
            },
        ],
        apple: "/favicon_io/apple-touch-icon.png",
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={`
        ${inter.variable}
        ${notoSans.variable}
        ${openSans.variable}
        ${outfit.variable}
        ${plusJakarta.variable}
        ${poppins.variable}
        ${roboto.variable}
        ${geist.variable}
      `}>
            <body className="font-sans antialiased">
                {children}
                <Analytics />
            </body>
        </html>
    )
}
