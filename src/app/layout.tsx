import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import GlassFilter from "@/components/GlassFilter";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLASX - Classroom Booking System",
  description: "Reserve your space with crystal-clear scheduling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="bg"></div>
        <div className="bg-tint"></div>

        <GlassFilter />

        <div className="app">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
