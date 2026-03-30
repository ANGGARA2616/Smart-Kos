"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadFile } from "@/lib/supabase-storage";

export async function createLaporan(formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== "USER") {
        return { error: "Akses ditolak" };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId }
    });

    if (!user || user.status !== "PENGHUNI" || !user.kamar_id) {
        return { error: "Hanya penghuni aktif yang bisa melaporkan kerusakan." };
    }

    const kategori = formData.get("kategori") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const file = formData.get("foto_kendala") as File | null;

    if (!kategori || !deskripsi) {
        return { error: "Kategori dan deskripsi wajib diisi." };
    }

    let fotoKendalaPath = null;

    if (file && file.size > 0) {
        try {
            fotoKendalaPath = await uploadFile(file, "tiket");
        } catch (error) {
            console.error(error);
            return { error: "Gagal mengunggah foto kendala." };
        }
    }

    await prisma.tiket.create({
        data: {
            user_id: user.id,
            kamar_id: user.kamar_id,
            kategori,
            prioritas: "Sedang",
            deskripsi,
            foto_kendala: fotoKendalaPath
        }
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
}
