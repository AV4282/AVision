import type { Metadata, Viewport } from "next";
import "@fontsource-variable/overpass";
import "@fontsource-variable/atkinson-hyperlegible-next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AVision",
  description: "Report problems around your city or campus to the people who can fix them.",
};

export const viewport: Viewport = {
  themeColor: "#14171a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
