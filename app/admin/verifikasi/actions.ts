"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveBooking(bookingId: string) {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
    });

    if (!booking) return { error: "Pesanan tidak ditemukan" };

    // Find the latest active booking to check for extension
    const lastActiveBooking = await prisma.booking.findFirst({
        where: {
            user_id: booking.user_id,
            status: "APPROVED",
            id: { not: bookingId }
        },
        orderBy: { tanggal_berakhir: "desc" }
    });

    let baseDate = new Date(); // Start counting from today
    // If an active booking is found and the end date is still in the future, extend it instead of losing days
    if (lastActiveBooking && lastActiveBooking.tanggal_berakhir && lastActiveBooking.tanggal_berakhir > baseDate) {
        baseDate = new Date(lastActiveBooking.tanggal_berakhir);
    }

    // Add months to baseDate based on booking.durasi_sewa
    const newTanggalBerakhir = new Date(baseDate);
    newTanggalBerakhir.setMonth(newTanggalBerakhir.getMonth() + booking.durasi_sewa);

    // Update booking status to APPROVED
    await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: "APPROVED",
            tanggal_berakhir: newTanggalBerakhir
        }
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
