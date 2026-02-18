// app/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTrades() {
  try {
    return await prisma.trade.findMany({
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error("Error fetching trades:", error);
    return [];
  }
}

export async function addTrade(data: any) {
  try {
    const newTrade = await prisma.trade.create({
      data: {
        dateEntry: String(data.dateEntry),
        dateExit: String(data.dateExit),
        instrument: String(data.instrument),
        position: String(data.position),
        entry: Number(data.entry),
        exit: Number(data.exit),
        lot: Number(data.lot),
        fees: Number(data.fees),
        pnl: Number(data.pnl),
        rate: Number(data.rate),
        result: String(data.result),
        notes: data.notes || null,
      },
    })
    revalidatePath('/')
    return newTrade
  } catch (error) {
    console.error("Error creating trade:", error);
    throw new Error("Gagal menyimpan trade ke database");
  }
}

export async function getTransactions() {
  try {
    return await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function addTransaction(data: any) {
  try {
    // Validasi data sebelum simpan
    if (!data.amount || isNaN(Number(data.amount))) {
      throw new Error("Jumlah (amount) harus berupa angka valid");
    }

    const newTx = await prisma.transaction.create({
      data: {
        date: String(data.date),
        type: String(data.type),
        amount: Number(data.amount),
        note: data.note ? String(data.note) : null,
      },
    })
    revalidatePath('/')
    return newTx
  } catch (error) {
    console.error("Error creating transaction in DB:", error);
    // Kita lempar error yang lebih spesifik agar tertangkap di catch UI
    throw error;
  }
}

export async function deleteTrade(id: number) {
  try {
    await prisma.trade.delete({
      where: { id },
    })
    revalidatePath('/')
  } catch (error) {
    console.error("Error deleting trade:", error);
    throw new Error("Gagal menghapus data");
  }
}

export async function updateTrade(id: number, data: any) {
  try {
    const updatedTrade = await prisma.trade.update({
      where: { id },
      data: {
        dateEntry: String(data.dateEntry),
        dateExit: String(data.dateExit),
        instrument: String(data.instrument),
        position: String(data.position),
        entry: Number(data.entry),
        exit: Number(data.exit),
        lot: Number(data.lot),
        fees: Number(data.fees),
        pnl: Number(data.pnl),
        rate: Number(data.rate),
        result: String(data.result),
        notes: data.notes || null,
      },
    })
    revalidatePath('/')
    return updatedTrade
  } catch (error) {
    console.error("Error updating trade:", error);
    throw new Error("Gagal memperbarui trade di database");
  }
}
