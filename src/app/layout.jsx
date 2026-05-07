import Navigation from "@/components/Navigation";
import GlassFilter from "@/components/GlassFilter";
import "./globals.css";

export const metadata = {
  title: "CLASX - Classroom Booking System",
  description: "Reserve your space with crystal-clear scheduling",
};

export default function RootLayout({ children }) {
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
