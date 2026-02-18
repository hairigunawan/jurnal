// app/api/trades/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.trade.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Trade dihapus' });
  } catch (error) {
    console.error("Delete API Error:", error);
    return NextResponse.json({ error: 'Gagal menghapus' }, { status: 500 });
  }
}
