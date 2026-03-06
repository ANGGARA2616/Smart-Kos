"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/auth";

export async function loginUser(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Semua form wajib diisi!" };
    }

    let userToLogin;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { error: "Email atau password salah." };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return { error: "Email atau password salah." };
        }

        userToLogin = user;

    } catch (error) {
        return { error: "Terjadi kesalahan sistem. Coba lagi nanti." };
    }

    // Buat sesi JWT dalam cookie HttpOnly
    await createSession(userToLogin.id, userToLogin.role, userToLogin.status);

    // Arahkan ke dashboard sesuai role
    if (userToLogin.role === "ADMIN") {
        redirect("/admin");
    } else {
        redirect("/dashboard");
    }
}
