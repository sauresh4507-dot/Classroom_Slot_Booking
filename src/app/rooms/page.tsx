"use client";

import { useEffect, useState } from "react";
import RoomCard from "@/components/RoomCard";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/rooms').then(r => r.json()).then(d => setRooms(d.data || []));
  }, []);

  const getFilteredRooms = () => {
    if (filter === 'free') return rooms.map((r: any) => ({...r, status: 'free'}));
    if (filter === 'busy') return [];
    if (filter !== 'all') return rooms.filter((r: any) => r.type === filter).map((r: any) => ({...r, status: 'free'}));
    return rooms.map((r: any) => ({...r, status: 'free'}));
  };

  const filtered = getFilteredRooms();

  return (
    <div className="page active" id="page-rooms">
      <div className="page-header">
        <span className="page-title">All Classrooms</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="filter-row">
            <button className={`filter-btn ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`filter-btn ${filter === 'free' ? 'on' : ''}`} onClick={() => setFilter('free')}>Available</button>
            <button className={`filter-btn ${filter === 'busy' ? 'on' : ''}`} onClick={() => setFilter('busy')}>Occupied</button>
            <button className={`filter-btn ${filter === 'Lecture Hall' ? 'on' : ''}`} onClick={() => setFilter('Lecture Hall')}>Lectures</button>
            <button className={`filter-btn ${filter === 'Computer Lab' ? 'on' : ''}`} onClick={() => setFilter('Computer Lab')}>Labs</button>
          </div>
          <div className="rooms-count">{filtered.length} rooms</div>
        </div>
      </div>
      <div className="rooms-scroll">
        <div className="rooms-grid">
          {filtered.map((r: any) => <RoomCard key={r.id} room={r} />)}
        </div>
      </div>
    </div>
  );
}
