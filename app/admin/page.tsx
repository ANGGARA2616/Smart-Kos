import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    const today = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    // 1. Fetch Data Real-Time
    const totalPenghuni = await prisma.user.count({ where: { status: "PENGHUNI" } });
    const totalKamarKosong = await prisma.kamar.count({ where: { status: "KOSONG" } });
    const totalPendingPembayaran = await prisma.booking.count({ where: { status: "PENDING" } });
    const totalKeluhanAktif = await prisma.tiket.count({ where: { status: { in: ["OPEN", "PROSES"] } } });

    // 2. Fetch 5 Transaksi Terkini
    const recentBookings = await prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true, kamar: true }
    });

    // 3. Fetch Seluruh Kamar untuk Ringkasan
    const kamars = await prisma.kamar.findMany({
        orderBy: { nomor_kamar: "asc" }
    });

    // 4. Fetch Keluhan Terbaru (Untuk Log Aktivitas)
    const recentTikets = await prisma.tiket.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        include: { kamar: true, user: true }
    });

    const SUMMARY_CARDS = [
        {
            title: "Total Penghuni Aktif",
            value: `${totalPenghuni} Orang`,
            icon: "👥",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Kamar Tersedia",
            value: `${totalKamarKosong} Kamar`,
            icon: "🛏",
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            title: "Menunggu Verifikasi",
            value: `${totalPendingPembayaran} Transaksi`,
            icon: "⏳",
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
        },
        {
            title: "Keluhan Fasilitas Aktif",
            value: `${totalKeluhanAktif} Laporan`,
            icon: "🔧",
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
        },
    ];

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
        <div className="p-8 bg-gray-50 min-h-full">
            {/* ========== TOP BAR ========== */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ringkasan Dasboard</h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Selamat datang kembali, Admin. Berikut ringkasan asrama secara Real-Time.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                        📅 {today}
                    </span>
                </div>
            </div>

            {/* ========== SUMMARY CARDS ========== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {SUMMARY_CARDS.map((card, idx) => (
                    <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardBody className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">{card.title}</p>
                                    <p className="text-2xl font-black text-gray-900">{card.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center text-2xl flex-shrink-0`}>
                                    {card.icon}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* ========== MAIN GRID: TABEL + AKTIVITAS ========== */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Tabel Transaksi Terbaru (2/3 width) */}
                <div className="xl:col-span-2 flex flex-col h-full">
                    <Card className="border-none shadow-sm flex-1">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold text-gray-900 text-base">Pembayaran & Pemesanan Terbaru</h2>
                            <Link href="/admin/verifikasi" className="text-primary text-xs font-semibold hover:underline">
                                Semua Verifikasi →
                            </Link>
                        </div>

                        {recentBookings.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm font-medium">Belum ada transaksi pemesanan terekam.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-left border-b border-gray-100">
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pemesan</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kamar</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nominal</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {recentBookings.map((trx) => (
                                            <tr key={trx.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-900">{trx.user.nama}</td>
                                                <td className="px-4 py-4 text-gray-600 font-medium tracking-tight">
                                                    #{trx.kamar.nomor_kamar} <span className="text-xs text-gray-400">({trx.kamar.tipe})</span>
                                                </td>
                                                <td className="px-4 py-4 text-gray-500 font-medium text-xs">
                                                    {trx.createdAt.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                                                </td>
                                                <td className="px-4 py-4 font-black text-gray-900">
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
                    </Card>
                </div>

                {/* Aktivitas Keluhan Terbaru (1/3 width) */}
                <div className="xl:col-span-1 flex flex-col h-full">
                    <Card className="border-none shadow-sm flex-1">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold text-gray-900 text-base">Keluhan Fasilitas Baru</h2>
                            <Link href="/admin/keluhan" className="text-primary text-xs font-semibold hover:underline">
                                Lihat semua
                            </Link>
                        </div>
                        <CardBody className="space-y-4">
                            {recentTikets.length === 0 ? (
                                <div className="py-4 text-center text-gray-500 text-sm font-medium">Kosong. Tidak ada laporan kerusakan.</div>
                            ) : (
                                recentTikets.map((tiket) => (
                                    <div key={tiket.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className={`w-9 h-9 rounded-full ${tiket.status === 'SELESAI' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} flex items-center justify-center text-sm flex-shrink-0`}>
                                            🔧
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs text-gray-800 font-bold leading-snug truncate">
                                                {tiket.kategori} <span className="font-normal text-gray-500">— {tiket.user.nama}</span>
                                            </p>
                                            <p className="text-[10px] text-gray-500 mt-1 font-semibold text-primary">Kamar #{tiket.kamar.nomor_kamar}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* ========== STATUS KAMAR DETAIL ========== */}
            <Card className="border-none shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 text-base">Denah Ringkasan Kamar</h2>
                    <Link href="/admin/kamar" className="text-primary text-xs font-semibold hover:underline">Kelola Semua Kamar →</Link>
                </div>
                <CardBody>
                    {kamars.length === 0 ? (
                        <div className="py-6 text-center text-gray-500 text-sm font-medium">Tidak ada data kamar asrama yang terdaftar.</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                            {kamars.map((kamar) => (
                                <div
                                    key={kamar.id}
                                    className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md hover:bg-white hover:border-primary/20 transition-all cursor-default"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-inner ${kamar.status === "TERISI" ? "bg-green-100" : kamar.status === "PERBAIKAN" ? "bg-red-100" : "bg-white"}`}>
                                        🛏
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-black text-gray-900 leading-none mb-1">#{kamar.nomor_kamar}</p>
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase">{kamar.tipe}</p>
                                    </div>
                                    <Badge variant={kamarBadgeMap[kamar.status]} className="text-[10px] px-2 py-0.5 mt-1 w-full text-center flex justify-center shadow-none">
                                        {kamar.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
