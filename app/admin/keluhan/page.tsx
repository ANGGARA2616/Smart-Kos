import { Card } from "@/components/ui/Card";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import StatusKeluhanButton from "@/components/admin/StatusKeluhanButton";

export const dynamic = "force-dynamic";

export default async function DaftarKeluhanPage() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    // Ambil data keluhan/tiket berurut dari yg OPEN, PROSES, dan SELESAI
    const tikets = await prisma.tiket.findMany({
        include: {
            user: true,
            kamar: true,
        },
        orderBy: [
            { status: "asc" },
            { createdAt: "desc" }
        ]
    });

    const statusBadgeMap: Record<string, "success" | "danger" | "warning"> = {
        OPEN: "danger",
        PROSES: "warning",
        SELESAI: "success",
    };

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Keluhan & Perbaikan Fasilitas</h1>
                <p className="text-gray-500 text-sm mt-0.5">Daftar laporan kerusakan (Tiket) yang diadukan oleh penghuni kamar.</p>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 text-base">Semua Laporan Tiket ({tikets.length})</h2>
                </div>

                {tikets.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                        <span className="text-5xl mb-4">👍</span>
                        <p className="font-semibold text-gray-600">Luar biasa! Tidak ada keluhan fasilitas saat ini.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left border-b border-gray-100">
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal & Penghuni</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kamar</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori / Deskripsi</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Foto</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {tikets.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50/70">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{t.user.nama}</p>
                                            <p className="text-xs text-gray-500">{t.createdAt.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })} • {t.user.no_hp}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-bold text-primary">#{t.kamar.nomor_kamar}</p>
                                            <p className="text-xs text-gray-500">{t.kamar.tipe}</p>
                                        </td>
                                        <td className="px-4 py-4 max-w-[200px]">
                                            <p className="font-semibold text-gray-800 text-xs uppercase mb-1">{t.kategori}</p>
                                            <p className="text-xs text-gray-500 leading-relaxed truncate" title={t.deskripsi}>{t.deskripsi}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            {t.foto_kendala ? (
                                                <a href={t.foto_kendala} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-200">
                                                    <span>📷</span> Lihat
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-400 font-medium">Kosong</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full ${t.status === 'OPEN' ? 'bg-red-100 text-red-600' :
                                                    t.status === 'PROSES' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                                                }`}>
                                                {t.status === 'OPEN' ? 'Menunggu' : t.status === 'PROSES' ? 'Diproses' : 'Selesai'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-end">
                                                <StatusKeluhanButton id={t.id} currentStatus={t.status} />
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
