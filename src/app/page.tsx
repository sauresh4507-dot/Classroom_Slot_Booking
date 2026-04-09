"use client";

import { useEffect, useState } from "react";
import RoomCard from "@/components/RoomCard";

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch('/api/rooms').then(r => r.json()).then(d => setRooms(d.data || []));
    fetch('/api/bookings').then(r => r.json()).then(d => setBookings(d.data || []));
  }, []);

  const freeRooms = Math.max(0, rooms.length - bookings.length);
  const bookedToday = bookings.length;

  return (
    <div className="page active" id="page-dashboard">
      <div className="hero">
        <h1>CLASSROOM<br />BOOKING SYSTEM</h1>
        <p>Reserve your space · Crystal-clear scheduling</p>
      </div>

      <div className="stats">
        <div className="stat-card crystal"><div className="crystal-inner"><div className="stat-val">{rooms.length}</div><div className="stat-lbl">Total Rooms</div></div></div>
        <div className="stat-card crystal"><div className="crystal-inner"><div className="stat-val">{freeRooms}</div><div className="stat-lbl">Available Now</div></div></div>
        <div className="stat-card crystal"><div className="crystal-inner"><div className="stat-val">{bookedToday}</div><div className="stat-lbl">Booked Today</div></div></div>
        <div className="stat-card crystal"><div className="crystal-inner"><div className="stat-val">{bookings.length}</div><div className="stat-lbl">My Bookings</div></div></div>
      </div>
      
      <div className="rooms-grid">
        {rooms.slice(0, 6).map((r: any) => <RoomCard key={r.id} room={{...r, status: 'free'}} />)}
      </div>
    </div>
  );
}
