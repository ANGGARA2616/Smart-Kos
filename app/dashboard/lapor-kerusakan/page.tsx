import { Card, CardBody } from "@/components/ui/Card";
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
            <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-primary mb-6 inline-flex items-center gap-1.5 transition-colors">
                ← Kembali ke Dashboard
            </Link>

            <h1 className="text-3xl font-black text-gray-900 mb-2 mt-2">Lapor Kerusakan Kamera atau Fasilitas</h1>
            <p className="text-gray-500 text-sm mb-8">
                Isi form di bawah ini jika fasilitas kamar Anda (No. {user.kamar.nomor_kamar} - {user.kamar.tipe}) mengalami masalah. Kami akan segera memperbaikinya.
            </p>

            <Card className="border-none shadow-sm shadow-gray-200">
                <CardBody className="p-8">
                    <LaporKerusakanForm />
                </CardBody>
            </Card>
        </div>
    );
}
