import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET || "super-secret-key-development";
const key = new TextEncoder().encode(secretKey);

export async function createSession(userId: string, role: string, statusUser: string) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week
    const session = await new SignJWT({ userId, role, statusUser })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(key);

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) return null;

    try {
        const { payload } = await jwtVerify(sessionCookie, key);
        return payload as { userId: string; role: string; statusUser: string };
    } catch (error) {
        return null;
    }
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}
