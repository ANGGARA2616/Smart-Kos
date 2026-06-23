import { Card } from "@/components/ui/legacy-card";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import StatusKeluhanButton from "@/components/admin/StatusKeluhanButton";
import { ThumbsUp, Camera } from "lucide-react";

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

    return (
        <div className="p-6 lg:p-8 min-h-full">
            <Card>
                <div className="px-6 py-4 border-b border-[#EAEDF3] flex items-center justify-between">
                    <h2 className="font-bold text-[#0E1424] text-base">Semua Laporan Tiket ({tikets.length})</h2>
                </div>

                {tikets.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-[#9AA3B4]">
                        <ThumbsUp className="h-12 w-12 mb-4 text-[#16A572]" strokeWidth={1.5} />
                        <p className="font-semibold text-[#7B8597]">Luar biasa! Tidak ada keluhan fasilitas saat ini.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#F9FAFC] text-left border-b border-[#EAEDF3]">
                                    <th className="px-6 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Tanggal & Penghuni</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Kamar</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Kategori / Deskripsi</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Foto</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F2F6]">
                                {tikets.map((t) => (
                                    <tr key={t.id} className="hover:bg-[#F4F6FA]">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-[#0E1424]">{t.user.nama}</p>
                                            <p className="text-xs text-[#7B8597]">{t.createdAt.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })} • {t.user.no_hp}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-bold text-[#2F6BFF]">#{t.kamar.nomor_kamar}</p>
                                            <p className="text-xs text-[#7B8597]">{t.kamar.tipe}</p>
                                        </td>
                                        <td className="px-4 py-4 max-w-[200px]">
                                            <p className="font-semibold text-[#384151] text-xs uppercase mb-1">{t.kategori}</p>
                                            <p className="text-xs text-[#7B8597] leading-relaxed truncate" title={t.deskripsi}>{t.deskripsi}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            {t.foto_kendala ? (
                                                <a href={t.foto_kendala} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F6BFF] hover:text-[#1A4FE0] bg-[#EAF0FF] hover:bg-[#DCE6FF] px-3 py-1.5 rounded-lg transition-colors border border-[#D4E1FF]">
                                                    <Camera className="h-3.5 w-3.5" strokeWidth={2} /> Lihat
                                                </a>
                                            ) : (
                                                <span className="text-xs text-[#9AA3B4] font-medium">Kosong</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full ${t.status === 'OPEN' ? 'bg-[#FDECEC] text-[#E5484D]' :
                                                    t.status === 'PROSES' ? 'bg-[#FFF4E0] text-[#B7791F]' : 'bg-[#E7F7EE] text-[#16A572]'
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
