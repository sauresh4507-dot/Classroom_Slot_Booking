import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const rooms = [
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

  for (const r of rooms) {
    await prisma.room.create({ data: r });
  }
  console.log('Database seeded with rooms');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
