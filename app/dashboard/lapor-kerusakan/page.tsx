import { Card, CardBody } from "@/components/ui/legacy-card";
import LaporKerusakanForm from "./LaporKerusakanForm";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LaporKerusakanPage() {
    const session = await getSession();
    if (!session || session.role !== "USER") {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { kamar: true }
    });

    if (!user || user.status !== "PENGHUNI" || !user.kamar) {
        redirect("/dashboard");
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg border border-[#D4E1FF] bg-white px-4 py-2 text-sm font-semibold text-[#2F6BFF] shadow-sm transition-colors hover:bg-[#EAF0FF] mb-6">
                Kembali ke Dashboard
            </Link>

            <h1 className="text-3xl font-black text-gray-900 mb-2 mt-2">Lapor Kerusakan Kamera atau Fasilitas</h1>
            <p className="text-gray-500 text-sm mb-8">
                Isi form di bawah ini jika fasilitas kamar Anda (No. {user.kamar.nomor_kamar} - {user.kamar.tipe}) mengalami masalah. Kami akan segera memperbaikinya.
            </p>

            <Card className="shadow-sm">
                <CardBody className="p-8">
                    <LaporKerusakanForm />
                </CardBody>
            </Card>
        </div>
    );
}
