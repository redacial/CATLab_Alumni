import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CATLab Network",
  description:
    "Connecting Westmont CATLab students with alumni — for mentorship, advice, and opportunities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-westmont-navy/10 py-6 text-center text-xs text-westmont-blue/60">
          CATLab Network · Center for Applied Technology · Westmont College
        </footer>
      </body>
    </html>
  );
}
