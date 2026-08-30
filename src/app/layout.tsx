import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ToastContainer from "@/components/Toast/Toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ditvi Crochet - Handmade With Love, Crafted For You",
  description: "Explore premium cozy handmade crochet bags, flowers, keychains, dolls, home decor, and custom creations by Ditvi Crochet.",
  keywords: ["crochet", "handmade", "crochet bags", "crochet flowers", "crochet keychains", "amigurumi dolls", "crochet gifts", "custom orders"],
  openGraph: {
    title: "Ditvi Crochet - Premium Handmade Crochet Boutique",
    description: "Cozy and beautiful handmade crochet creations, crafted thoughtfully just for you.",
    type: "website",
    locale: "en_US",
    siteName: "Ditvi Crochet",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body>
        <AppProvider>
          <Navbar />
          <main style={{ paddingTop: "80px", minHeight: "calc(100vh - 180px)" }}>
            {children}
          </main>
          <ToastContainer />
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
