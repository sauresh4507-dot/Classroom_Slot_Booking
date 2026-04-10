"use client";
import { useEffect, useState } from "react";

function getWeekDates(dateStr: string) {
  const d = new Date(dateStr + "T00:00");
  const day = d.getDay(); // 0=Sun
  const monday = new Date(d);
  monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 5 }, (_, i) => {
    const dd = new Date(monday);
    dd.setDate(monday.getDate() + i);
    return dd.toISOString().split("T")[0];
  });
}

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function SchedulePage() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch("/api/rooms").then(r => r.json()).then(d => {
      setRooms(d.data || []);
      if (d.data && d.data.length > 0) setRoomId(String(d.data[0].id));
    });
    fetch("/api/bookings").then(r => r.json()).then(d => setBookings(d.data || []));
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  const weekDates = date ? getWeekDates(date) : [];

  const getBooking = (weekDateStr: string, hour: string) =>
    (bookings as any[]).find(
      (b: any) => b.roomId === parseInt(roomId) && b.date === weekDateStr && b.startTime === hour
    );

  const selectedRoom: any = (rooms as any[]).find((r: any) => r.id === parseInt(roomId));

  return (
    <div className="page active" id="page-schedule">
      <div className="crystal" style={{ marginBottom: "20px" }}>
        <div className="crystal-inner" style={{ padding: "13px 20px", display: "flex", alignItems: "center", gap: "13px", flexWrap: "wrap", borderRadius: "inherit" }}>
          <label style={{ fontSize: ".65rem", letterSpacing: ".1em", color: "var(--text-muted)", textTransform: "uppercase" }}>Week of</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ padding: "8px 13px", background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.8)", borderRadius: "10px", color: "var(--text-dark)", fontFamily: "'Inter',sans-serif", fontSize: ".9rem", outline: "none", width: "auto" }}
          />
          <label style={{ fontSize: ".65rem", letterSpacing: ".1em", color: "var(--text-muted)", textTransform: "uppercase" }}>Room</label>
          <select
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
            style={{ padding: "8px 13px", background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.8)", borderRadius: "10px", color: "var(--text-dark)", fontFamily: "'Inter',sans-serif", fontSize: ".9rem", outline: "none", minWidth: "140px" }}
          >
            {(rooms as any[]).map((r: any) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          {selectedRoom && (
            <span style={{ fontSize: ".65rem", color: "var(--text-muted)", letterSpacing: ".08em" }}>
              cap. {selectedRoom.capacity} · {selectedRoom.building}
            </span>
          )}
        </div>
      </div>

      <div className="crystal">
        <div className="crystal-inner" style={{ overflowX: "auto", borderRadius: "inherit" }}>
          <div className="sch-wrap">
            {/* Header: TIME + Mon–Fri with actual dates */}
            <div className="sch-head">
              <div className="sch-th">TIME</div>
              {weekDates.map((wd, i) => (
                <div key={wd} className="sch-th" style={{ lineHeight: "1.4" }}>
                  <div>{DAY_LABELS[i]}</div>
                  <div style={{ fontSize: ".45rem", opacity: 0.6 }}>
                    {new Date(wd + "T00:00").toLocaleDateString("en", { month: "short", day: "numeric" })}
                  </div>
                </div>
              ))}
            </div>

            {/* Rows: one per hour */}
            {HOURS.map(h => (
              <div key={h} className="sch-row">
                <div className="sch-time">{h}</div>
                {weekDates.map(wd => {
                  const bk = getBooking(wd, h);
                  return bk ? (
                    <div key={wd} className="sch-slot sch-booked" title={`${bk.purpose} · ${bk.startTime}–${bk.endTime}`}>
                      {bk.purpose || "Booked"}
                    </div>
                  ) : (
                    <div key={wd} className="sch-slot sch-empty">FREE</div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
