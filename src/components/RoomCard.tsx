"use client";

import { useRouter } from "next/navigation";

export default function RoomCard({ room }: { room: any }) {
  const router = useRouter();
  
  // Default to free if no status explicit
  const status = room.status || 'free';
  const statusBadge = status === 'free' ? 'badge-free' : 'badge-busy';
  const statusText = status === 'free' ? '● AVAILABLE' : '● OCCUPIED';

  return (
    <div className="room-card crystal" data-type={room.type} title={room.name} onClick={() => router.push(`/book?roomId=${room.id}`)}>
      <div className="crystal-inner">
        <div className="room-tag">{room.type}</div>
        <div className="room-name">{room.name}</div>
        <div className="room-meta">
          Bldg: {room.building}{room.floor != null ? ` · Floor ${room.floor}` : ""}<br/>
          Cap: {room.capacity} seats<br/>
          {room.amenities}
        </div>
        <span className={`room-badge ${statusBadge}`}>{statusText}</span>
      </div>
    </div>
  );
}
