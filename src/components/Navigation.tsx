"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  // Persist theme across reloads
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <nav>
      <div className="logo">⬡ CLASX</div>
      <div className="nav-tabs">
        <Link href="/" className={`nav-tab ${pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
        <Link href="/rooms" className={`nav-tab ${pathname === '/rooms' ? 'active' : ''}`}>Rooms</Link>
        <Link href="/book" className={`nav-tab ${pathname === '/book' ? 'active' : ''}`}>Book</Link>
        <Link href="/schedule" className={`nav-tab ${pathname === '/schedule' ? 'active' : ''}`}>Schedule</Link>
        <Link href="/mybookings" className={`nav-tab ${pathname === '/mybookings' ? 'active' : ''}`}>My Bookings</Link>
        <Link href="/upcoming" className={`nav-tab ${pathname === '/upcoming' ? 'active' : ''}`}>Upcoming</Link>
      </div>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label="Toggle theme"
      >
        {dark ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}
