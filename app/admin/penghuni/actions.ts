"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function tambahPenghuniManual(formData: FormData) {
    const nama = formData.get("nama") as string;
    const email = formData.get("email") as string;
    const no_hp = formData.get("no_hp") as string;
    const kamar_id = formData.get("kamar_id") as string;
    const durasi_sewa = parseInt(formData.get("durasi_sewa") as string || "1");

    if (!nama || !email || !no_hp || !kamar_id || !durasi_sewa) {
        return { error: "Semua kolom wajib diisi." };
    }

    // Cek jika email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return { error: "Email ini sudah terdaftar di sistem." };
    }

    // Cek kamar valid & kosong
    const kamar = await prisma.kamar.findUnique({ where: { id: kamar_id } });
    if (!kamar || kamar.status !== "KOSONG") {
        return { error: "Kamar yang dipilih tidak tersedia atau sudah terisi." };
    }

    // Hitung tanggal berakhir dari hari ini
    const now = new Date();
    const tanggalBerakhir = new Date(now);
    tanggalBerakhir.setMonth(tanggalBerakhir.getMonth() + durasi_sewa);

    const totalHarga = kamar.harga_per_bulan * durasi_sewa;

    // Hash default password
    const hashedPassword = await bcrypt.hash("penghuni123", 10);

    try {
        // Buat user baru sebagai PENGHUNI
        const user = await prisma.user.create({
            data: {
                nama,
                email,
                password: hashedPassword,
                no_hp,
                role: "USER",
                status: "PENGHUNI",
                kamar_id,
            }
        });

        // Buat booking APPROVED secara otomatis
        await prisma.booking.create({
            data: {
                user_id: user.id,
                kamar_id,
                status: "APPROVED",
                durasi_sewa,
                total_harga: totalHarga,
                tanggal_berakhir: tanggalBerakhir,
            }
        });

        // Ubah status kamar menjadi TERISI
        await prisma.kamar.update({
            where: { id: kamar_id },
            data: { status: "TERISI" }
        });
    } catch (error) {
        console.error("Tambah penghuni error:", error);
        return { error: "Gagal menambahkan penghuni. Silakan coba lagi." };
    }

    revalidatePath("/admin/penghuni");
    revalidatePath("/admin/kamar");
    redirect("/admin/penghuni");
}

export async function hapusPenghuni(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "Penghuni tidak ditemukan." };

    // Jika user punya kamar, kosongkan kamarnya
    if (user.kamar_id) {
        await prisma.kamar.update({
            where: { id: user.kamar_id },
            data: { status: "KOSONG" }
        });
    }

    // Hapus semua booking, tiket, transaksi, lalu user-nya
    await prisma.booking.deleteMany({ where: { user_id: userId } });
    await prisma.tiket.deleteMany({ where: { user_id: userId } });
    await prisma.transaksi.deleteMany({ where: { user_id: userId } });
    await prisma.user.delete({ where: { id: userId } });

    revalidatePath("/admin/penghuni");
    revalidatePath("/admin/kamar");
}
