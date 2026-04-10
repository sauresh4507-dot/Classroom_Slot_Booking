"use client";
import { useEffect, useState } from "react";

function timeUntil(dateStr: string, startTime: string) {
    const now = new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, min] = startTime.split(':').map(Number);
    const target = new Date(year, month - 1, day, hour, min);
    const diff = target.getTime() - now.getTime();
    if (diff < 0) return null; // past
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return { label: `in ${days}d ${hours}h`, urgency: days <= 1 ? 'soon' : 'upcoming' };
    if (hours > 0) return { label: `in ${hours}h ${mins}m`, urgency: 'soon' };
    return { label: `in ${mins}m`, urgency: 'now' };
}

export default function UpcomingPage() {
    const [bookings, setBookings] = useState([]);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        fetch('/api/bookings').then(r => r.json()).then(d => setBookings(d.data || []));
        const tick = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(tick);
    }, []);

    const today = now.toISOString().split('T')[0];
    const upcoming = [...bookings as any[]]
        .filter((b: any) => b.date >= today)
        .sort((a: any, b: any) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.startTime.localeCompare(b.startTime);
        });

    const urgencyColor = (u: string | undefined) => {
        if (u === 'now') return { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.45)', color: '#ef4444' };
        if (u === 'soon') return { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.4)', color: '#ca8a04' };
        return { bg: 'rgba(8,145,178,0.07)', border: 'rgba(8,145,178,0.35)', color: 'var(--accent)' };
    };

    return (
        <div className="page active" id="page-upcoming">
            <div className="page-header">
                <span className="page-title">Upcoming Bookings</span>
                <div className="rooms-count">{upcoming.length} scheduled</div>
            </div>

            {upcoming.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '64px 24px',
                    color: 'var(--text-muted)', fontFamily: "'Orbitron',sans-serif",
                    fontSize: '.75rem', letterSpacing: '.15em'
                }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '16px', opacity: 0.3 }}>◷</div>
                    NO UPCOMING BOOKINGS
                </div>
            ) : (
                <div className="bk-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {upcoming.map((b: any) => {
                        const until = timeUntil(b.date, b.startTime);
                        const uc = urgencyColor(until?.urgency);
                        return (
                            <div key={b.id} className="bk-item crystal">
                                <div className="crystal-inner" style={{
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                    padding: '16px 20px', borderRadius: 'inherit'
                                }}>
                                    {/* Date badge */}
                                    <div style={{
                                        minWidth: '52px', textAlign: 'center', flexShrink: 0,
                                        background: 'rgba(8,145,178,0.08)', border: '1px solid rgba(8,145,178,0.25)',
                                        borderRadius: '10px', padding: '8px 6px',
                                        fontFamily: "'Orbitron',sans-serif",
                                    }}>
                                        <div style={{ fontSize: '.55rem', color: 'var(--text-muted)', letterSpacing: '.08em' }}>
                                            {new Date(b.date + 'T00:00').toLocaleDateString('en', { month: 'short' }).toUpperCase()}
                                        </div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>
                                            {new Date(b.date + 'T00:00').getDate()}
                                        </div>
                                        <div style={{ fontSize: '.5rem', color: 'var(--text-muted)', letterSpacing: '.06em' }}>
                                            {new Date(b.date + 'T00:00').toLocaleDateString('en', { weekday: 'short' }).toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontFamily: "'Orbitron',sans-serif", fontSize: '.85rem',
                                            fontWeight: 600, marginBottom: '4px', color: 'var(--text-dark)'
                                        }}>
                                            {b.roomName || `Room #${b.roomId}`}
                                        </div>
                                        <div style={{ fontSize: '.8rem', color: 'var(--text-mid)' }}>
                                            {b.startTime} – {b.endTime}
                                            {b.purpose ? ` · ${b.purpose}` : ''}
                                        </div>
                                    </div>

                                    {/* Countdown badge */}
                                    {until && (
                                        <div style={{
                                            padding: '5px 12px', borderRadius: '999px',
                                            background: uc.bg, border: `1px solid ${uc.border}`,
                                            color: uc.color, fontFamily: "'Orbitron',sans-serif",
                                            fontSize: '.55rem', fontWeight: 700, letterSpacing: '.08em',
                                            whiteSpace: 'nowrap', flexShrink: 0
                                        }}>
                                            {until.label}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
