import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GE Scout | OSRS flipping analytics",
  description: "Find high-volume Grand Exchange flipping opportunities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
