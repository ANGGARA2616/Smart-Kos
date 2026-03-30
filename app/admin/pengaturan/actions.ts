"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadFile, uploadMultipleFiles } from "@/lib/supabase-storage";

export async function updateKostProfile(formData: FormData) {
    const id = formData.get("id") as string;
    const nama_kost = formData.get("nama_kost") as string;
    const alamat = formData.get("alamat") as string;
    const nomor_kontak = formData.get("nomor_kontak") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const hero_title = formData.get("hero_title") as string;
    const link_gmaps = formData.get("link_gmaps") as string;
    const link_gmaps_button = formData.get("link_gmaps_button") as string;
    const file = formData.get("foto_hero") as File | null;
    
    // Payment Support
    const nama_bank = formData.get("nama_bank") as string;
    const nomor_rekening = formData.get("nomor_rekening") as string;
    const nama_pemilik_rekening = formData.get("nama_pemilik_rekening") as string;
    const file_qris = formData.get("foto_qris") as File | null;
    const file_logo = formData.get("logo_url") as File | null;
    
    // Support multiple slider images
    const rawFiles = formData.getAll("hero_images");
    const heroImageFiles = rawFiles.filter(f => f instanceof File && f.size > 0) as File[];

    if (!nama_kost || !alamat || !nomor_kontak || !deskripsi || !hero_title) {
        throw new Error("Semua kolom wajib diisi!");
    }

    let foto_hero = undefined;
    let foto_qris = undefined;
    let logo_url = undefined;
    let sliderImages: string[] = [];

    // Upload logo
    if (file_logo && file_logo.size > 0) {
        const url = await uploadFile(file_logo, "logo");
        if (url) logo_url = url;
    }

    // Upload QRIS
    if (file_qris && file_qris.size > 0) {
        const url = await uploadFile(file_qris, "qris");
        if (url) foto_qris = url;
    }

    // Upload slider images (multiple)
    if (heroImageFiles.length > 0) {
        sliderImages = await uploadMultipleFiles(heroImageFiles, "slider");
    }

    // Upload foto hero utama
    if (file && file.size > 0) {
        const url = await uploadFile(file, "hero");
        if (url) foto_hero = url;
    }

    if (id) {
        await prisma.kostProfile.update({
            where: { id },
            data: { 
                nama_kost, alamat, nomor_kontak, deskripsi, hero_title, link_gmaps, link_gmaps_button, nama_bank, nomor_rekening, nama_pemilik_rekening,
                ...(foto_hero && { foto_hero }),
                ...(foto_qris && { foto_qris }),
                ...(logo_url && { logo_url }),
                ...(sliderImages.length > 0 && { hero_images: sliderImages })
            }
        });
    } else {
        await prisma.kostProfile.create({
            data: { 
                nama_kost, alamat, nomor_kontak, deskripsi, hero_title, link_gmaps, link_gmaps_button, foto_hero, nama_bank, nomor_rekening, nama_pemilik_rekening, foto_qris,
                ...(logo_url && { logo_url }),
                ...(sliderImages.length > 0 && { hero_images: sliderImages })
            }
        });
    }

    revalidatePath("/", "layout");
    redirect("/admin/pengaturan?success=1");
}
