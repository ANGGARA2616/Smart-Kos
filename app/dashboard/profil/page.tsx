import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProfilForm from "./ProfilForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { nama: true, email: true, no_hp: true },
    });

    if (!user) redirect("/login");

    return (
        <div>
            <div className="mb-8">
                <Link href="/dashboard" className="text-sm text-primary font-medium hover:underline flex items-center gap-1 mb-4">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span> Kembali ke Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h1>
                <p className="text-gray-500 text-sm mt-1">Kelola informasi akun dan keamanan Anda.</p>
            </div>
            <ProfilForm user={user} />
        </div>
    );
}
