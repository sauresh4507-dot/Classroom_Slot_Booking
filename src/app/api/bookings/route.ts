import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({ include: { room: true } });
    const formatted = bookings.map(b => ({
      ...b,
      roomName: b.room.name
    }));
    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { roomId, date, startTime, endTime, purpose } = body;

    // Check for double bookings
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId: parseInt(roomId),
        date: date,
        startTime: startTime
      }
    });

    if (conflict) {
      return NextResponse.json({ success: false, error: 'Slot already booked!' }, { status: 400 });
    }

    const newBooking = await prisma.booking.create({
      data: {
        roomId: parseInt(roomId),
        date,
        startTime,
        endTime,
        purpose: purpose || 'Class Session',
      },
      include: { room: true }
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        ...newBooking,
        roomName: newBooking.room.name
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
