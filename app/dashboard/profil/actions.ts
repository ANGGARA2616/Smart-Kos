"use server";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfile(formData: FormData) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const nama = formData.get("nama") as string;
    const no_hp = formData.get("no_hp") as string;

    if (!nama || !no_hp) {
        return { error: "Nama dan nomor HP wajib diisi." };
    }

    await prisma.user.update({
        where: { id: session.userId },
        data: { nama, no_hp },
    });

    revalidatePath("/dashboard");
    return { success: "Profil berhasil diperbarui." };
}

export async function changePassword(formData: FormData) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const currentPassword = formData.get("current_password") as string;
    const newPassword = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { error: "Semua field password wajib diisi." };
    }

    if (newPassword.length < 6) {
        return { error: "Password baru minimal 6 karakter." };
    }

    if (newPassword !== confirmPassword) {
        return { error: "Konfirmasi password tidak cocok." };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
    });

    if (!user) {
        return { error: "User tidak ditemukan." };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return { error: "Password lama salah." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: session.userId },
        data: { password: hashedPassword },
    });

    return { success: "Password berhasil diubah." };
}
