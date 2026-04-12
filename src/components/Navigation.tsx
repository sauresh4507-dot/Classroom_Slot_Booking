"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [time, setTime] = useState<string>("--");

  const [date, setDate] = useState<string>("");

  // Persist theme across reloads
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  // Live Clock interval
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div className="logo">⬡ CLASX</div>
        <div className="nav-tabs">
          <Link href="/" className={`nav-tab ${pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
          <Link href="/rooms" className={`nav-tab ${pathname === '/rooms' ? 'active' : ''}`}>Rooms</Link>
          <Link href="/book" className={`nav-tab ${pathname === '/book' ? 'active' : ''}`}>Book</Link>
          <Link href="/schedule" className={`nav-tab ${pathname === '/schedule' ? 'active' : ''}`}>Schedule</Link>
          <Link href="/mybookings" className={`nav-tab ${pathname === '/mybookings' ? 'active' : ''}`}>My Bookings</Link>
          <Link href="/upcoming" className={`nav-tab ${pathname === '/upcoming' ? 'active' : ''}`}>Upcoming</Link>
        </div>
      </div>
      <div className="clock-widget" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '0.85rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(8,145,178,0.1)', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(8,145,178,0.2)' }}>
        <span style={{ fontSize: '0.9rem' }}>📅</span> {date}
        <span style={{ fontSize: '0.9rem', marginLeft: '6px' }}>⏱</span> {time}
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
