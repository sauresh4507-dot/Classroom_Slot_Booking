"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Since we use useSearchParams, wrap in Suspense for Next.js app router strict modes
function BookContent() {
  const searchParams = useSearchParams();
  const preselectedRoom = searchParams.get('roomId');
  
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState(preselectedRoom || "");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [purpose, setPurpose] = useState("");
  
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch('/api/rooms').then(r => r.json()).then(d => {
      setRooms(d.data || []);
      if (!preselectedRoom && d.data && d.data.length > 0) setRoomId(String(d.data[0].id));
    });
    fetch('/api/bookings').then(r => r.json()).then(d => setBookings(d.data || []));
    setDate(new Date().toISOString().split('T')[0]);
  }, [preselectedRoom]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  const submitBooking = async () => {
    if (!roomId || !date) { showToast('Please fill all required fields'); return; }
    
    // Optimistic checking
    if (bookings.find((b: any) => b.roomId === parseInt(roomId) && b.date === date && b.startTime === startTime)) { 
      showToast('Slot already booked!'); return; 
    }
    
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, date, startTime, endTime, purpose })
    });
    const d = await res.json();
    if (d.success) {
      const rName = rooms.find((x: any) => x.id === parseInt(roomId))?.['name'] || 'Room';
      showToast(`Booked: ${rName} · ${startTime}–${endTime}`);
      setBookings([...bookings, d.data] as any);
    } else {
      showToast(d.error || 'Failed to book slot');
    }
  };

  const r: any = rooms.find((x: any) => x.id === parseInt(roomId));
  const hrs = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const rb = bookings.filter((b: any) => b.roomId === parseInt(roomId) && b.date === date);

  return (
    <div className="page active" id="page-book">
      <div className="form-section">
        <div className="form-card crystal">
          <div className="crystal-inner">
            <h2>New Booking</h2>
            <div className="form-group"><label>Room</label>
              <select value={roomId} onChange={e => setRoomId(e.target.value)}>
                <option value="">— Select a room —</option>
                {rooms.map((r: any) => <option key={r.id} value={r.id}>{r.name} ({r.type}, cap. {r.capacity})</option>)}
              </select>
            </div>
            <div className="form-group"><label>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
            <div className="form-group"><label>Start Time</label>
              <select value={startTime} onChange={e => setStartTime(e.target.value)}>
                {hrs.map(h => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div className="form-group"><label>End Time</label>
              <select value={endTime} onChange={e => setEndTime(e.target.value)}>
                {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map(h => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Purpose</label><input type="text" placeholder="e.g. CS101 Lecture" value={purpose} onChange={e => setPurpose(e.target.value)} /></div>
            <div className="btn-wrap"><button className="btn-crystal-main" onClick={submitBooking}>CONFIRM BOOKING</button></div>
          </div>
        </div>

        <div className="form-card crystal">
          <div className="crystal-inner">
            <h2>Room Details</h2>
            <div id="quick-info" style={{ color: 'var(--text-muted)', fontSize: '.88rem', lineHeight: 2 }}>
              {!r ? <p>← Select a room to see details</p> : (
                <>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '.85rem', fontWeight: 600, marginBottom: '10px', color: 'var(--text-dark)' }}>{r.name}</div>
                  <table style={{ width: '100%', fontSize: '.82rem' }}>
                    <tbody>
                      <tr><td style={{ color: 'var(--text-muted)', padding: '3px 0', width: '100px' }}>Type</td><td style={{ color: 'var(--text-dark)' }}>{r.type}</td></tr>
                      <tr><td style={{ color: 'var(--text-muted)', padding: '3px 0' }}>Building</td><td style={{ color: 'var(--text-dark)' }}>{r.building}</td></tr>
                      <tr><td style={{ color: 'var(--text-muted)', padding: '3px 0' }}>Capacity</td><td style={{ color: 'var(--text-dark)' }}>{r.capacity}</td></tr>
                      <tr><td style={{ color: 'var(--text-muted)', padding: '3px 0' }}>Amenities</td><td style={{ color: 'var(--text-dark)' }}>{r.amenities}</td></tr>
                    </tbody>
                  </table>
                  <div style={{ marginTop: '20px' }}>
                    <h2>Availability</h2>
                    <div id="quick-slots" style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {hrs.map(h => {
                        const busy = rb.some((b: any) => b.startTime === h);
                        return (
                          <div key={h} style={{
                            padding: '4px 10px', borderRadius: '7px', fontSize: '.6rem', fontFamily: "'Orbitron',sans-serif",
                            background: busy ? 'rgba(124,58,237,0.08)' : 'rgba(8,145,178,0.07)',
                            border: `1px solid ${busy ? 'rgba(124,58,237,0.4)' : 'rgba(8,145,178,0.4)'}`,
                            color: busy ? 'var(--accent2)' : 'var(--accent)'
                          }}>
                            {h} {busy ? '●' : '○'}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}

export default function BookPage() {
  return <Suspense fallback={<div className="page active">Loading...</div>}><BookContent /></Suspense>;
}
