"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function updateKostProfile(formData: FormData) {
    const id = formData.get("id") as string;
    const nama_kost = formData.get("nama_kost") as string;
    const alamat = formData.get("alamat") as string;
    const nomor_kontak = formData.get("nomor_kontak") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const hero_title = formData.get("hero_title") as string;
    const link_gmaps = formData.get("link_gmaps") as string;
    const file = formData.get("foto_hero") as File | null;
    
    // Payment Support
    const nama_bank = formData.get("nama_bank") as string;
    const nomor_rekening = formData.get("nomor_rekening") as string;
    const nama_pemilik_rekening = formData.get("nama_pemilik_rekening") as string;
    const file_qris = formData.get("foto_qris") as File | null;
    const file_logo = formData.get("logo_url") as File | null;
    
    // Support multiple slider images
    const rawFiles = formData.getAll("hero_images");
    let sliderImages: string[] = [];
    const heroImageFiles = rawFiles.filter(f => f instanceof File && f.size > 0) as File[];

    if (!nama_kost || !alamat || !nomor_kontak || !deskripsi || !hero_title) {
        throw new Error("Semua kolom wajib diisi!");
    }

    let foto_hero = undefined;
    let foto_qris = undefined;
    let logo_url = undefined;

    if (file_logo && file_logo.size > 0) {
        try {
            const bytes = await file_logo.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const timestamp = Date.now();
            const fileExt = file_logo.name.split('.').pop() || 'png';
            const filename = `logo-${timestamp}.${fileExt}`;
            const relativePath = `/uploads/${filename}`;
            const uploadDir = join(process.cwd(), "public", "uploads");
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            logo_url = relativePath;
        } catch (error) {
            console.error("Upload Logo error: ", error);
        }
    }

    if (file_qris && file_qris.size > 0) {
        try {
            const bytes = await file_qris.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const timestamp = Date.now();
            const fileExt = file_qris.name.split('.').pop() || 'jpg';
            const filename = `qris-${timestamp}.${fileExt}`;
            const relativePath = `/uploads/${filename}`;
            const uploadDir = join(process.cwd(), "public", "uploads");
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            foto_qris = relativePath;
        } catch (error) {
            console.error("Upload QRIS error: ", error);
            throw new Error("Gagal mengunggah foto QRIS.");
        }
    }

    if (heroImageFiles.length > 0) {
        for (const f of heroImageFiles) {
            try {
                const bytes = await f.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const timestamp = Date.now();
                const fileExt = f.name.split('.').pop() || 'jpg';
                const filename = `slider-${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const relativePath = `/uploads/${filename}`;
                const uploadDir = join(process.cwd(), "public", "uploads");
                const filepath = join(uploadDir, filename);

                await writeFile(filepath, buffer);
                sliderImages.push(relativePath);
            } catch (error) {
                console.error("Upload slider error: ", error);
            }
        }
    }

    if (file && file.size > 0) {
        try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            const timestamp = Date.now();
            const fileExt = file.name.split('.').pop() || 'jpg';
            const filename = `hero-${timestamp}.${fileExt}`;
            const relativePath = `/uploads/${filename}`;
            const uploadDir = join(process.cwd(), "public", "uploads");
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            foto_hero = relativePath;
        } catch (error) {
            console.error("Upload error: ", error);
            throw new Error("Gagal mengunggah foto hero.");
        }
    }

    if (id) {
        // Update existing
        await prisma.kostProfile.update({
            where: { id },
            data: { 
                nama_kost, alamat, nomor_kontak, deskripsi, hero_title, link_gmaps, nama_bank, nomor_rekening, nama_pemilik_rekening,
                ...(foto_hero && { foto_hero }),
                ...(foto_qris && { foto_qris }),
                ...(logo_url && { logo_url }),
                ...(sliderImages.length > 0 && { hero_images: sliderImages })
            }
        });
    } else {
        // Create first time if not exists somehow
        await prisma.kostProfile.create({
            data: { 
                nama_kost, alamat, nomor_kontak, deskripsi, hero_title, link_gmaps, foto_hero, nama_bank, nomor_rekening, nama_pemilik_rekening, foto_qris,
                ...(logo_url && { logo_url }),
                ...(sliderImages.length > 0 && { hero_images: sliderImages })
            }
        });
    }

    revalidatePath("/", "layout"); // Update all layouts
    redirect("/admin/pengaturan?success=1");
}
