import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Mark, Arrow } from "@/components/icons";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    default: "Forum — Ideas that move people forward",
    template: "%s | Forum",
  },
  description:
    "Connect your people with inspiring speakers and thoughtfully designed corporate learning programs. Explore leadership, innovation, and meaningful change.",
  openGraph: { type: "website", siteName: "Forum", locale: "en_US" },
  robots: { index: process.env.DEMO_MODE !== "true", follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {process.env.DEMO_MODE === "true" ? (
          <div className="demo-banner">
            Sample experience · All speaker profiles and programs are fictional.
          </div>
        ) : null}
        <Navigation />
        <main id="main">{children}</main>
        <footer className="footer">
          <div className="container">
            <div className="footer-top">
              <div>
                <Link href="/" className="brand">
                  <Mark />
                  forum.
                </Link>
                <p>
                  Extraordinary people.
                  <br />
                  Lasting perspectives.
                </p>
              </div>
              <div className="footer-links">
                <Link href="/speakers">
                  Our speakers <Arrow diagonal />
                </Link>
                <Link href="/programs">
                  Our programs <Arrow diagonal />
                </Link>
                <Link href="/contact">
                  Get in touch <Arrow diagonal />
                </Link>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} Forum. All rights reserved.</p>
              <p>Ideas. Connection. Impact.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
