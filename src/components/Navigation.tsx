"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

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
    </nav>
  );
}
