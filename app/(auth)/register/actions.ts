"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
    const nama = formData.get("nama") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const no_hp = formData.get("no_hp") as string;

    if (!nama || !email || !password || !no_hp) {
        return { error: "Semua form wajib diisi!" };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "Email sudah terdaftar. Silakan gunakan email lain." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                nama,
                email,
                password: hashedPassword,
                no_hp,
            },
        });
    } catch (error) {
        return { error: "Terjadi kesalahan saat mendaftarkan akun. Coba lagi." };
    }

    // Redirect ke halaman login setelah registrasi sukses
    redirect("/login");
}
