import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "D-CHSS | AI Dengue Detection from CBC Report",
  description:
    "An interpretable Clinical Hematological Signature-based ML framework (D-CHSS) for instant, explainable Dengue detection from your CBC blood report.",
  keywords: [
    "Dengue Detection",
    "D-CHSS",
    "CBC Analysis",
    "Machine Learning",
    "Hematology AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-800`}>
        <AuthProvider>
          <DataProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
