import { Card, CardBody } from "@/components/ui/Card";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LaporanKeuanganPage() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    // Ambil semua transaksi/booking yang "APPROVED"
    const approvedBookings = await prisma.booking.findMany({
        where: { status: "APPROVED" },
        include: {
            user: true,
            kamar: true,
        },
        orderBy: { updatedAt: "desc" }
    });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let totalPendapatanKeseluruhan = 0;
    let totalPendapatanBulanIni = 0;
    let totalPendapatanBulanLalu = 0;

    approvedBookings.forEach((booking) => {
        const nominal = booking.kamar.harga_per_bulan;
        totalPendapatanKeseluruhan += nominal;

        const date = new Date(booking.updatedAt);
        const bookingMonth = date.getMonth();
        const bookingYear = date.getFullYear();

        if (bookingMonth === currentMonth && bookingYear === currentYear) {
            totalPendapatanBulanIni += nominal;
        } else if (bookingMonth === lastMonth && bookingYear === lastMonthYear) {
            totalPendapatanBulanLalu += nominal;
        }
    });

    // Menghitung persentase kenaikan/penurunan
    let persentase = 0;
    let isPositive = true;

    if (totalPendapatanBulanLalu > 0) {
        persentase = ((totalPendapatanBulanIni - totalPendapatanBulanLalu) / totalPendapatanBulanLalu) * 100;
        if (persentase < 0) {
            isPositive = false;
        }
    } else if (totalPendapatanBulanIni > 0) {
        // Jika bulan lalu 0 tapi bulan ini ada, anggap naik 100%
        persentase = 100;
    }

    const persentaseFormatted = Math.abs(persentase).toFixed(1);

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
                <p className="text-gray-500 text-sm mt-0.5">Ringkasan pendapatan asrama kos berdasarkan transaksi yang telah disetujui.</p>
            </div>

            {/* Rekap Ringkasan Widget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="border-none shadow-sm h-full">
                    <CardBody className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 mb-1">Total Pendapatan Bulan Ini</p>
                                <p className="text-3xl font-black text-gray-900">Rp {totalPendapatanBulanIni.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                💰
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {isPositive ? '↑' : '↓'} {persentaseFormatted}%
                            </span>
                            <span className="text-xs font-medium text-gray-500">Di Banding Bulan Sebelumnya</span>
                        </div>
                    </CardBody>
                </Card>

                <Card className="border-none shadow-sm h-full bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                    <CardBody className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400 mb-1">Total Pendapatan Keseluruhan</p>
                                <p className="text-3xl font-black text-white">Rp {totalPendapatanKeseluruhan.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                📊
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <span className="text-xs font-medium text-gray-400">Total riwayat transaksi masuk yang terekam sistem</span>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Riwayat Transaksi Tabel */}
            <Card className="border-none shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900 text-base">Riwayat Transaksi Masuk (Disetujui)</h2>
                </div>

                {approvedBookings.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                        <span className="text-5xl mb-4">💳</span>
                        <p className="font-semibold text-gray-600">Belum ada pemasukan yang disetujui.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left border-b border-gray-100">
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Diterima</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Penghuni</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kamar & Tipe</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Metode</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Nominal Pendapatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {approvedBookings.map((b) => (
                                    <tr key={b.id} className="hover:bg-slate-50/70">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">
                                                {b.updatedAt.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {b.updatedAt.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{b.user.nama}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-primary">#{b.kamar.nomor_kamar}</span>
                                            <span className="text-gray-500 text-xs ml-1">({b.kamar.tipe})</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                                Transfer
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="font-black text-gray-900 text-base">
                                                +Rp {b.kamar.harga_per_bulan.toLocaleString("id-ID")}
                                            </p>
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
