import type { Metadata } from "next";
import { Syne, Figtree } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AudioProvider, MuteControl } from "@/components/MuteControl";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "VibeCodeCity.cloud — Creative AI Literacy Academy",
    template: "%s · VibeCodeCity.cloud",
  },
  description:
    "An immersive academy for creative AI literacy, built for minds that think differently. Learn to wield AI as a tool. Drop into deeper creative states through intentional sound and entrainment.",
  metadataBase: new URL("https://vibecodecity.cloud"),
  openGraph: {
    title: "VibeCodeCity.cloud",
    description: "Immersive academy for creative AI literacy.",
    siteName: "VibeCodeCity.cloud",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${figtree.variable}`}>
      <body className="flex min-h-dvh flex-col font-body antialiased">
        <AudioProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-cyan focus:px-4 focus:py-2 focus:text-void"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <MuteControl />
        </AudioProvider>
      </body>
    </html>
  );
}
