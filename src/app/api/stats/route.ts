import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const [rooms, bookings] = await Promise.all([
            prisma.room.findMany(),
            prisma.booking.findMany({ include: { room: true } }),
        ]);

        const totalRooms = rooms.length;
        const totalBookings = bookings.length;
        const availableRooms = Math.max(0, totalRooms - new Set(bookings.map(b => b.roomId)).size);

        // Bookings grouped by room type
        const byType: Record<string, number> = {};
        for (const b of bookings) {
            const type = b.room.type;
            byType[type] = (byType[type] || 0) + 1;
        }

        return NextResponse.json({
            success: true,
            data: {
                totalRooms,
                totalBookings,
                availableRooms,
                bookingsByType: byType,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
