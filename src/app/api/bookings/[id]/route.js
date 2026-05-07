import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req, props) {
  try {
    const params = await props.params;
    const id = parseInt(params.id, 10);

    // Guard: parseInt returns NaN for non-numeric IDs; Prisma would throw a cryptic
    // internal error instead of a meaningful response, so we short-circuit here.
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid booking ID' }, { status: 400 });
    }

    await prisma.booking.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
