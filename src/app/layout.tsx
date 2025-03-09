import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./ui/font";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Excercice app Next.js Dashboard app router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
