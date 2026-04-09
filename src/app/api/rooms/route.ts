import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

const defaultRooms = [
  { name: 'ALPHA-101', building: 'Block A', capacity: 40, type: 'Lecture Hall', amenities: 'Projector · AC · Whiteboard' },
  { name: 'BETA-201', building: 'Block B', capacity: 60, type: 'Seminar Room', amenities: 'Smart Board · AC · Mic' },
  { name: 'GAMMA-301', building: 'Block C', capacity: 30, type: 'Computer Lab', amenities: '40 PCs · AC · Projector' },
  { name: 'DELTA-401', building: 'Block D', capacity: 80, type: 'Lecture Hall', amenities: 'Projector · AC · Podium' },
  { name: 'ALPHA-102', building: 'Block A', capacity: 25, type: 'Tutorial Room', amenities: 'Whiteboard · AC' },
  { name: 'BETA-202', building: 'Block B', capacity: 50, type: 'Seminar Room', amenities: 'Smart Board · AC' },
  { name: 'SIGMA-501', building: 'Block S', capacity: 100, type: 'Auditorium', amenities: 'Stage · Full AV · AC' },
  { name: 'GAMMA-302', building: 'Block C', capacity: 30, type: 'Computer Lab', amenities: '30 PCs · AC' },
  { name: 'DELTA-402', building: 'Block D', capacity: 45, type: 'Lecture Hall', amenities: 'Projector · AC' },
  { name: 'ALPHA-103', building: 'Block A', capacity: 20, type: 'Tutorial Room', amenities: 'Whiteboard' },
  { name: 'OMEGA-601', building: 'Block O', capacity: 70, type: 'Lecture Hall', amenities: 'Dual Projector · AC' },
  { name: 'SIGMA-502', building: 'Block S', capacity: 30, type: 'Seminar Room', amenities: 'Smart Board · AC' },
];

export async function GET() {
  try {
    let rooms = await prisma.room.findMany();
    // Auto-seed if db is empty
    if (rooms.length === 0) {
      await prisma.room.createMany({ data: defaultRooms });
      rooms = await prisma.room.findMany();
    }
    return NextResponse.json({ success: true, count: rooms.length, data: rooms });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
