"use client";
import { useEffect, useState } from "react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [cancelTarget, setCancelTarget] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch('/api/bookings').then(r => r.json()).then(d => setBookings(d.data || []));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    const res = await fetch(`/api/bookings/${cancelTarget}`, { method: 'DELETE' });
    const d = await res.json();
    if (d.success) {
      setBookings(bookings.filter((b: any) => b.id !== cancelTarget));
      showToast('Booking cancelled.');
    } else {
      showToast('Failed to cancel booking.');
    }
    setCancelTarget(null);
  };

  return (
    <div className="page active" id="page-mybookings">
      <div className="bk-list" id="my-booking-list">
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontFamily: "'Orbitron',sans-serif", fontSize: '.75rem', letterSpacing: '.15em' }}>NO BOOKINGS YET</div>
        ) : (
          bookings.map((b: any) => (
            <div key={b.id} className="bk-item crystal">
              <div className="crystal-inner" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: 'inherit' }}>
                <div className="bk-icon" style={{ width: '44px', height: '44px', borderRadius: '11px', flexShrink: 0, background: 'linear-gradient(135deg,rgba(8,145,178,0.15),rgba(124,58,237,0.1))', border: '1px solid rgba(8,145,178,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Orbitron',sans-serif", fontSize: '.65rem', fontWeight: 700, color: 'var(--accent)' }}>
                  {b.roomName?.slice(0, 2) || 'RM'}
                </div>
                <div className="bk-info" style={{ flex: 1 }}>
                  <div className="bk-room" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '.85rem', fontWeight: 600, marginBottom: '3px', color: 'var(--text-dark)' }}>{b.roomName}</div>
                  <div className="bk-detail" style={{ fontSize: '.8rem', color: 'var(--text-mid)' }}>{b.date} · {b.startTime}–{b.endTime} · {b.purpose}</div>
                </div>
                <button className="btn-cancel" style={{ padding: '6px 14px', borderRadius: '999px', fontFamily: "'Orbitron',sans-serif", fontSize: '.55rem', fontWeight: 600, letterSpacing: '.1em', border: '1px solid rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.07)', color: 'var(--accent2)', cursor: 'pointer', transition: 'all .3s' }} onClick={() => setCancelTarget(b.id)}>CANCEL</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={`modal-overlay ${cancelTarget !== null ? 'open' : ''}`} id="modal">
        <div className="modal-box crystal">
          <div className="crystal-inner">
            <h2>Cancel Booking</h2>
            <p id="modal-body">Are you sure you want to cancel this booking?</p>
            <div className="modal-btns">
              <button className="btn-outline" onClick={() => setCancelTarget(null)}>KEEP IT</button>
              <div className="btn-wrap" style={{ flex: 1 }}>
                <button className="btn-crystal-main" style={{ padding: '10px 20px', fontSize: '.62rem' }} onClick={confirmCancel}>CANCEL BOOKING</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}
