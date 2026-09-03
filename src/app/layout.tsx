import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import siteConfig from "@/data/siteConfig.json";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import SiteShell from "@/components/SiteShell";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: "Ditvi Crochet | Handmade Crochet Bags, Flowers & Gifts",
  description: "Discover premium handcrafted crochet bags, flowers, keychains, dolls, and custom gifts by Ditvi Crochet. Thoughtfully made with love for every special moment.",
  keywords: [
    "crochet", "handmade crochet", "crochet bags", "crochet flowers", "crochet keychains",
    "amigurumi dolls", "crochet gifts", "custom crochet orders", "Ditvi Crochet"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ditvi Crochet | Handmade Crochet Boutique",
    description: "Premium handmade crochet creations crafted with warmth, charm, and artistry.",
    url: siteConfig.siteUrl,
    type: "website",
    locale: "en_US",
    siteName: "Ditvi Crochet",
    images: [
      {
        url: new URL("/logo/logo.png", siteConfig.siteUrl).toString(),
        width: 512,
        height: 512,
        alt: "Ditvi Crochet logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ditvi Crochet | Handmade Crochet Boutique",
    description: "Premium handmade crochet creations crafted with warmth, charm, and artistry.",
    images: [new URL("/logo/logo.png", siteConfig.siteUrl).toString()],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ubuntu.variable}>
      <body>
        <AppProvider>
          <AuthProvider>
            <SiteShell>{children}</SiteShell>
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
