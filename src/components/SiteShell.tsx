"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ToastContainer from "@/components/Toast/Toast";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!isAdminRoute && <Navbar />}
      <main style={{ paddingTop: isAdminRoute ? 0 : "80px", flex: 1 }}>
        {children}
      </main>
      <ToastContainer />
      {!isAdminRoute && <Footer />}
    </div>
  );
}
