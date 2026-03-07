"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateKostProfile(formData: FormData) {
    const id = formData.get("id") as string;
    const nama_kost = formData.get("nama_kost") as string;
    const alamat = formData.get("alamat") as string;
    const nomor_kontak = formData.get("nomor_kontak") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const hero_title = formData.get("hero_title") as string;

    if (!nama_kost || !alamat || !nomor_kontak || !deskripsi || !hero_title) {
        throw new Error("Semua kolom wajib diisi!");
    }

    if (id) {
        // Update existing
        await prisma.kostProfile.update({
            where: { id },
            data: { nama_kost, alamat, nomor_kontak, deskripsi, hero_title }
        });
    } else {
        // Create first time if not exists somehow
        await prisma.kostProfile.create({
            data: { nama_kost, alamat, nomor_kontak, deskripsi, hero_title }
        });
    }

    revalidatePath("/"); // Update Landing Page
    revalidatePath("/admin/pengaturan"); // Update Admin Page
    redirect("/admin/pengaturan?success=1");
}
