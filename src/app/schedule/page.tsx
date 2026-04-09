"use client";
import { useEffect, useState } from "react";

export default function SchedulePage() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch('/api/rooms').then(r => r.json()).then(d => {
      setRooms(d.data || []);
      if (d.data && d.data.length > 0) setRoomId(String(d.data[0].id));
    });
    fetch('/api/bookings').then(r => r.json()).then(d => setBookings(d.data || []));
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const hrs = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  // Sample filler for aesthetic visual completeness on schedule board
  const samp = [[0, '10:00', 'CS101'], [1, '09:00', 'MATH'], [2, '11:00', 'PHY'], [3, '14:00', 'LAB'], [4, '13:00', 'ENG'], [0, '14:00', 'CS102'], [2, '09:00', 'BIO']];

  return (
    <div className="page active" id="page-schedule">
      <div className="crystal" style={{ marginBottom: '20px' }}>
        <div className="crystal-inner" style={{ padding: '13px 20px', display: 'flex', alignItems: 'center', gap: '13px', flexWrap: 'wrap', borderRadius: 'inherit' }}>
          <label style={{ fontSize: '.65rem', letterSpacing: '.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Week of</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: '8px 13px', background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '10px', color: 'var(--text-dark)', fontFamily: "'Rajdhani',sans-serif", fontSize: '.9rem', outline: 'none', width: 'auto' }} />
          <label style={{ fontSize: '.65rem', letterSpacing: '.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Room</label>
          <select value={roomId} onChange={e => setRoomId(e.target.value)} style={{ padding: '8px 13px', background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '10px', color: 'var(--text-dark)', fontFamily: "'Rajdhani',sans-serif", fontSize: '.9rem', outline: 'none', minWidth: '130px' }}>
            {rooms.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <div className="btn-wrap" style={{ borderRadius: '999px' }}>
            <button className="btn-crystal-main" style={{ padding: '8px 20px', fontSize: '.6rem' }}>VIEW</button>
          </div>
        </div>
      </div>
      <div className="crystal">
        <div className="crystal-inner" style={{ overflowX: 'auto', borderRadius: 'inherit' }}>
          <div className="sch-wrap">
            <div className="sch-head">
              <div className="sch-th">TIME</div>
              {days.map(d => <div key={d} className="sch-th">{d}</div>)}
            </div>
            {hrs.map(h => (
              <div key={h} className="sch-row">
                <div className="sch-time">{h}</div>
                {days.map((_, i) => {
                  const ub = bookings.find((b: any) => b.roomId === parseInt(roomId) && b.startTime === h);
                  const sb = samp.find((s: any) => s[0] === i && s[1] === h);
                  if (ub) return <div key={i} className="sch-slot sch-booked">{(ub as any).purpose}</div>;
                  if (sb) return <div key={i} className="sch-slot sch-booked">{sb[2]}</div>;
                  return <div key={i} className="sch-slot sch-empty">FREE</div>;
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
