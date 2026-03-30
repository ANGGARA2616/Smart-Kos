"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadFile } from "@/lib/supabase-storage";

export async function submitPembayaran(formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "Silakan Masuk Kembali" };

    const kamar_id = formData.get("kamar_id") as string;
    const file = formData.get("bukti_transfer") as File;
    const durasi_sewa = parseInt(formData.get("durasi_sewa") as string || "1");
    const total_harga = parseInt(formData.get("total_harga") as string || "0");

    if (!file || file.size === 0) {
        return { error: "Bukti transfer berupa foto wajib diunggah." };
    }

    try {
        const publicUrl = await uploadFile(file, "bukti-transfer");

        if (!publicUrl) {
            return { error: "Gagal mengunggah bukti transfer. Silakan coba lagi." };
        }

        await prisma.booking.create({
            data: {
                user_id: session.userId,
                kamar_id,
                payment_proof: publicUrl,
                status: "PENDING",
                durasi_sewa,
                total_harga
            }
        });

    } catch (error) {
        console.error("Upload error: ", error);
        return { error: "Gagal memproses pembayaran. Silakan coba lagi." };
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}
