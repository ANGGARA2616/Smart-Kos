import { Card, CardBody } from "@/components/ui/legacy-card";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Wallet, BarChart3, CreditCard, TrendingUp, TrendingDown } from "lucide-react";

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
        <div className="p-6 lg:p-8 min-h-full">
            {/* Rekap Ringkasan Widget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="h-full">
                    <CardBody className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-[#7B8597] mb-1">Total Pendapatan Bulan Ini</p>
                                <p className="text-3xl font-extrabold tracking-tight text-[#0E1424]">Rp {totalPendapatanBulanIni.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E7F7EE] text-[#16A572]">
                                <Wallet className="h-6 w-6" strokeWidth={2} />
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#EAEDF3] flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-[#E7F7EE] text-[#16A572]' : 'bg-[#FDECEC] text-[#E5484D]'}`}>
                                {isPositive ? <TrendingUp className="h-3 w-3" strokeWidth={2.5} /> : <TrendingDown className="h-3 w-3" strokeWidth={2.5} />} {persentaseFormatted}%
                            </span>
                            <span className="text-xs font-medium text-[#7B8597]">Di Banding Bulan Sebelumnya</span>
                        </div>
                    </CardBody>
                </Card>

                <Card className="h-full bg-gradient-to-br from-[#0E1424] to-[#1A2236] text-white border-transparent">
                    <CardBody className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-white/60 mb-1">Total Pendapatan Keseluruhan</p>
                                <p className="text-3xl font-extrabold tracking-tight text-white">Rp {totalPendapatanKeseluruhan.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                                <BarChart3 className="h-6 w-6" strokeWidth={2} />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <span className="text-xs font-medium text-white/60">Total riwayat transaksi masuk yang terekam sistem</span>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Riwayat Transaksi Tabel */}
            <Card>
                <div className="px-6 py-4 border-b border-[#EAEDF3]">
                    <h2 className="font-bold text-[#0E1424] text-base">Riwayat Transaksi Masuk (Disetujui)</h2>
                </div>

                {approvedBookings.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-[#9AA3B4]">
                        <CreditCard className="h-12 w-12 mb-4 text-[#C9D0DC]" strokeWidth={1.5} />
                        <p className="font-semibold text-[#7B8597]">Belum ada pemasukan yang disetujui.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#F9FAFC] text-left border-b border-[#EAEDF3]">
                                    <th className="px-6 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Tanggal Diterima</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Nama Penghuni</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Kamar & Tipe</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Metode</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider text-right">Nominal Pendapatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F2F6]">
                                {approvedBookings.map((b) => (
                                    <tr key={b.id} className="hover:bg-[#F4F6FA]">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-[#0E1424]">
                                                {b.updatedAt.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                            <p className="text-xs text-[#7B8597] mt-0.5">
                                                {b.updatedAt.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-[#0E1424]">{b.user.nama}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-[#2F6BFF]">#{b.kamar.nomor_kamar}</span>
                                            <span className="text-[#7B8597] text-xs ml-1">({b.kamar.tipe})</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-[#EAF0FF] text-[#2F6BFF] rounded text-[10px] font-bold uppercase tracking-wider border border-[#D4E1FF]">
                                                Transfer
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="font-extrabold text-[#16A572] text-base">
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
