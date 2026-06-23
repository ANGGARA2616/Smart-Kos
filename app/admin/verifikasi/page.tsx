import { Card } from "@/components/ui/legacy-card";
import prisma from "@/lib/prisma";
import VerifikasiActions from "@/components/admin/VerifikasiActions";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CheckCircle2, FileText } from "lucide-react";

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
        <div className="p-6 lg:p-8 min-h-full">
            <Card>
                <div className="px-6 py-4 border-b border-[#EAEDF3] flex items-center justify-between">
                    <h2 className="font-bold text-[#0E1424] text-base">Menunggu Verifikasi ({bookings.length})</h2>
                </div>

                {bookings.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-[#9AA3B4]">
                        <CheckCircle2 className="h-12 w-12 mb-4 text-[#16A572]" strokeWidth={1.5} />
                        <p className="font-semibold text-[#7B8597]">Tidak ada bukti transfer yang perlu diverifikasi.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#F9FAFC] text-left border-b border-[#EAEDF3]">
                                    <th className="px-6 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Tanggal</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Calon Penghuni</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Kamar & Tipe</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Sewa & Tagihan</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Bukti Transfer</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F2F6]">
                                {bookings.map((b) => (
                                    <tr key={b.id} className="hover:bg-[#F4F6FA]">
                                        <td className="px-6 py-4 text-[#5A6477]">
                                            {b.createdAt.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-bold text-[#0E1424]">{b.user.nama}</p>
                                            <p className="text-xs text-[#7B8597]">{b.user.no_hp}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-bold text-[#2F6BFF]">#{b.kamar.nomor_kamar}</p>
                                            <p className="text-xs text-[#7B8597]">{b.kamar.tipe}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-bold text-[#0E1424]">{b.durasi_sewa} Bulan</p>
                                            <p className="text-xs font-semibold text-[#B7791F]">Rp {b.total_harga.toLocaleString('id-ID')}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            {b.payment_proof ? (
                                                <a href={b.payment_proof} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F6BFF] hover:text-[#1A4FE0] bg-[#EAF0FF] hover:bg-[#DCE6FF] px-3 py-1.5 rounded-lg transition-colors border border-[#D4E1FF]">
                                                    <FileText className="h-3.5 w-3.5" strokeWidth={2} /> Lihat Bukti
                                                </a>
                                            ) : (
                                                <span className="text-xs text-[#9AA3B4]">Tidak ada</span>
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
