import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "OSA Genesis — Lifetime Founder Pass",
  description: "The first 50 OSA Founder Passes. Numbered. Verifiable. Permanent.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link className="brand" href="/">OSA</Link>
          <nav>
            <Link href="/claim">Claim</Link>
            <Link href="/vault">Vault</Link>
            <Link href="/login">OSA ID</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
