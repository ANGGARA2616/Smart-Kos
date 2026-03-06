import { Card } from "@/components/ui/Card";
import prisma from "@/lib/prisma";
import VerifikasiActions from "@/components/admin/VerifikasiActions";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function VerifikasiPage() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    // Ambil data pemesanan yang statusnya masih PENDING
    const bookings = await prisma.booking.findMany({
        where: { status: "PENDING" },
        include: {
            user: true,
            kamar: true,
        },
        orderBy: { createdAt: "asc" }
    });

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Verifikasi Pembayaran</h1>
                <p className="text-gray-500 text-sm mt-0.5">Daftar unggahan bukti transfer dari calon penghuni yang membutuhkan persetujuan.</p>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 text-base">Menunggu Verifikasi ({bookings.length})</h2>
                </div>

                {bookings.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                        <span className="text-5xl mb-4">✅</span>
                        <p className="font-semibold text-gray-600">Tidak ada bukti transfer yang perlu diverifikasi.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left border-b border-gray-100">
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Calon Penghuni</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kamar & Tipe</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bukti Transfer</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookings.map((b) => (
                                    <tr key={b.id} className="hover:bg-slate-50/70">
                                        <td className="px-6 py-4 text-gray-600">
                                            {b.createdAt.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-bold text-gray-900">{b.user.nama}</p>
                                            <p className="text-xs text-gray-500">{b.user.no_hp}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-bold text-primary">#{b.kamar.nomor_kamar}</p>
                                            <p className="text-xs text-gray-500">{b.kamar.tipe}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            {b.payment_proof ? (
                                                <a href={b.payment_proof} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-200">
                                                    <span>📄</span> Lihat Bukti
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-400">Tidak ada</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-end">
                                                <VerifikasiActions id={b.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
