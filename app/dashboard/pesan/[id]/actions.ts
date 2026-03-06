"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function submitPembayaran(formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "Silakan Masuk Kembali" };

    const kamar_id = formData.get("kamar_id") as string;
    const file = formData.get("bukti_transfer") as File;

    if (!file || file.size === 0) {
        return { error: "Bukti transfer berupa foto wajib diunggah." };
    }

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define a unique name
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop() || 'jpg';
        const filename = `${timestamp}-${session.userId}.${fileExt}`;
        const relativePath = `/uploads/${filename}`;
        const uploadDir = join(process.cwd(), "public", "uploads");
        const filepath = join(uploadDir, filename);

        // Ensure we save it safely, but since standard create doesn't natively do mkdirp out of the box in simple JS, 
        // We'll write it directly (Assuming /public/uploads will be generated or exists, I will create a .gitkeep later)
        await writeFile(filepath, buffer);

        // Update DB
        await prisma.booking.create({
            data: {
                user_id: session.userId,
                kamar_id,
                payment_proof: relativePath,
                status: "PENDING"
            }
        });

    } catch (error) {
        console.error("Upload error: ", error);
        return { error: "Gagal memproses pembayaran. Pastikan folder public/uploads sudah ada atau gunakan file gambar kecil." };
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}
