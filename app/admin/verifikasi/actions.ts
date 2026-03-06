"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveBooking(bookingId: string) {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
    });

    if (!booking) return { error: "Pesanan tidak ditemukan" };

    // Update booking status to APPROVED
    await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "APPROVED" }
    });

    // Update room status to TERISI
    await prisma.kamar.update({
        where: { id: booking.kamar_id },
        data: { status: "TERISI" }
    });

    // Update user status and assigned room
    await prisma.user.update({
        where: { id: booking.user_id },
        data: {
            status: "PENGHUNI",
            kamar_id: booking.kamar_id
        }
    });

    revalidatePath("/admin/verifikasi");
    revalidatePath("/admin/kamar");
}

export async function rejectBooking(bookingId: string) {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
    });

    if (!booking) return { error: "Pesanan tidak ditemukan" };

    // Update booking status to REJECTED
    await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "REJECTED" }
    });

    revalidatePath("/admin/verifikasi");
}
