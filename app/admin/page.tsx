import { Badge } from "@/components/ui/legacy-badge";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { BedDouble, Wrench } from "lucide-react";
import OkupansiDonut from "@/components/admin/OkupansiDonut";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    // 1. Fetch 5 Transaksi Terkini
    const recentBookings = await prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true, kamar: true }
    });

    // 2. Fetch Seluruh Kamar untuk Ringkasan
    const kamars = await prisma.kamar.findMany({
        orderBy: { nomor_kamar: "asc" }
    });

    // 3. Fetch Keluhan Terbaru (Untuk Log Aktivitas)
    const recentTikets = await prisma.tiket.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        include: { kamar: true, user: true }
    });

    // Hitung komposisi status kamar dari data yang sudah di-fetch (tanpa query tambahan)
    const kamarTerisi = kamars.filter((k) => k.status === "TERISI").length;
    const kamarKosong = kamars.filter((k) => k.status === "KOSONG").length;
    const kamarPerbaikan = kamars.filter((k) => k.status === "PERBAIKAN").length;

    // Status Map untuk Kamar & Transaksi
    const kamarBadgeMap: Record<string, "success" | "danger" | "warning" | "neutral"> = {
        TERISI: "success",
        KOSONG: "neutral",
        PERBAIKAN: "danger",
    };

    const statusBadgeMap: Record<string, "success" | "danger" | "warning"> = {
        APPROVED: "success",
        PENDING: "warning",
        REJECTED: "danger",
    };

    const statusLabelMap: Record<string, string> = {
        APPROVED: "Disetujui",
        PENDING: "Menunggu",
        REJECTED: "Ditolak",
    };

    return (
        <div className="p-6 lg:p-8 min-h-full">
            {/* ========== GRID ATAS: OKUPANSI + KELUHAN (bersampingan) ========== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Okupansi Kamar (kiri atas) */}
                <div className="flex flex-col">
                    <div className="rounded-2xl border border-[#EAEDF3] bg-white shadow-sm flex-1 overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#EAEDF3] flex items-center justify-between">
                            <h2 className="font-bold text-[#0E1424] text-base">Okupansi Kamar</h2>
                            <Link href="/admin/kamar" className="text-[#2F6BFF] text-xs font-semibold hover:underline">Kelola Kamar</Link>
                        </div>
                        <div className="p-6">
                            <OkupansiDonut terisi={kamarTerisi} kosong={kamarKosong} perbaikan={kamarPerbaikan} />
                        </div>
                    </div>
                </div>

                {/* Keluhan Fasilitas Baru (kanan atas) */}
                <div className="flex flex-col">
                    <div className="rounded-2xl border border-[#EAEDF3] bg-white shadow-sm flex-1 overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#EAEDF3] flex items-center justify-between">
                            <h2 className="font-bold text-[#0E1424] text-base">Keluhan Fasilitas Baru</h2>
                            <Link href="/admin/keluhan" className="text-[#2F6BFF] text-xs font-semibold hover:underline">
                                Lihat semua
                            </Link>
                        </div>
                        <div className="p-5 space-y-3">
                            {recentTikets.length === 0 ? (
                                <div className="py-4 text-center text-[#7B8597] text-sm font-medium">Kosong. Tidak ada laporan kerusakan.</div>
                            ) : (
                                recentTikets.map((tiket) => (
                                    <div key={tiket.id} className="flex items-start gap-3 p-3 bg-[#F9FAFC] rounded-xl border border-[#EAEDF3]">
                                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tiket.status === 'SELESAI' ? 'bg-[#E7F7EE] text-[#16A572]' : 'bg-[#FDECEC] text-[#E5484D]'}`}>
                                            <Wrench className="h-4 w-4" strokeWidth={2} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs text-[#0E1424] font-bold leading-snug truncate">
                                                {tiket.kategori} <span className="font-normal text-[#7B8597]">— {tiket.user.nama}</span>
                                            </p>
                                            <p className="text-[10px] mt-1 font-semibold text-[#2F6BFF]">Kamar #{tiket.kamar.nomor_kamar}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== PEMBAYARAN & PEMESANAN TERBARU (lebar penuh) ========== */}
            <div className="rounded-2xl border border-[#EAEDF3] bg-white shadow-sm overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-[#EAEDF3] flex items-center justify-between">
                    <h2 className="font-bold text-[#0E1424] text-base">Pembayaran & Pemesanan Terbaru</h2>
                    <Link href="/admin/verifikasi" className="text-[#2F6BFF] text-xs font-semibold hover:underline">
                        Semua Verifikasi
                    </Link>
                </div>

                {recentBookings.length === 0 ? (
                    <div className="p-8 text-center text-[#7B8597] text-sm font-medium">Belum ada transaksi pemesanan terekam.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#F9FAFC] text-left border-b border-[#EAEDF3]">
                                    <th className="px-6 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Pemesan</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Kamar</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Tanggal</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Nominal</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F2F6]">
                                {recentBookings.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-[#F4F6FA] transition-colors">
                                        <td className="px-6 py-4 font-bold text-[#0E1424]">{trx.user.nama}</td>
                                        <td className="px-4 py-4 text-[#5A6477] font-medium tracking-tight">
                                            #{trx.kamar.nomor_kamar} <span className="text-xs text-[#9AA3B4]">({trx.kamar.tipe})</span>
                                        </td>
                                        <td className="px-4 py-4 text-[#7B8597] font-medium text-xs">
                                            {trx.createdAt.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                                        </td>
                                        <td className="px-4 py-4 font-extrabold text-[#0E1424]">
                                            Rp {trx.kamar.harga_per_bulan.toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <Badge variant={statusBadgeMap[trx.status]}>
                                                {statusLabelMap[trx.status]}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ========== STATUS KAMAR DETAIL ========== */}
            <div className="rounded-2xl border border-[#EAEDF3] bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#EAEDF3] flex items-center justify-between">
                    <h2 className="font-bold text-[#0E1424] text-base">Denah Ringkasan Kamar</h2>
                    <Link href="/admin/kamar" className="text-[#2F6BFF] text-xs font-semibold hover:underline">Kelola Semua Kamar</Link>
                </div>
                <div className="p-6">
                    {kamars.length === 0 ? (
                        <div className="py-6 text-center text-[#7B8597] text-sm font-medium">Tidak ada data kamar asrama yang terdaftar.</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                            {kamars.map((kamar) => (
                                <div
                                    key={kamar.id}
                                    className="flex flex-col items-center gap-2 p-4 bg-[#F9FAFC] rounded-xl border border-[#EAEDF3] hover:shadow-md hover:bg-white hover:border-[#C9D6FF] transition-all cursor-default"
                                >
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${kamar.status === "TERISI" ? "bg-[#E7F7EE] text-[#16A572]" : kamar.status === "PERBAIKAN" ? "bg-[#FDECEC] text-[#E5484D]" : "bg-white text-[#7B8597] border border-[#EAEDF3]"}`}>
                                        <BedDouble className="h-5 w-5" strokeWidth={2} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-extrabold text-[#0E1424] leading-none mb-1">#{kamar.nomor_kamar}</p>
                                        <p className="text-[10px] text-[#9AA3B4] font-semibold uppercase">{kamar.tipe}</p>
                                    </div>
                                    <Badge variant={kamarBadgeMap[kamar.status]} className="text-[10px] px-2 py-0.5 mt-1 w-full text-center flex justify-center shadow-none">
                                        {kamar.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
