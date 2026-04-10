"use client";

import { useEffect, useState } from "react";
import RoomCard from "@/components/RoomCard";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/rooms').then(r => r.json()).then(d => setRooms(d.data || []));
  }, []);

  const getFilteredRooms = () => {
    let result: any[] = rooms.map((r: any) => ({ ...r, status: 'free' }));
    if (filter === 'busy') return [];
    if (filter !== 'all' && filter !== 'free') result = result.filter((r: any) => r.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r: any) =>
        r.name?.toLowerCase().includes(q) ||
        r.building?.toLowerCase().includes(q) ||
        r.type?.toLowerCase().includes(q) ||
        r.amenities?.toLowerCase().includes(q)
      );
    }
    return result;
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

      {/* Live search bar */}
      <div style={{ padding: '0 0 18px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(8,145,178,0.25)',
          borderRadius: '12px', padding: '0 14px',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ color: 'var(--accent)', fontSize: '1rem', opacity: 0.7 }}>⌕</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, building, type, amenities…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text-dark)', fontSize: '.85rem', padding: '12px 0',
              fontFamily: 'inherit',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', fontSize: '1rem', padding: '0 4px'
            }}>✕</button>
          )}
        </div>
      </div>

      <div className="rooms-scroll">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontFamily: "'Orbitron',sans-serif", fontSize: '.75rem', letterSpacing: '.15em' }}>
            NO ROOMS FOUND
          </div>
        ) : (
          <div className="rooms-grid">
            {filtered.map((r: any) => <RoomCard key={r.id} room={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}
