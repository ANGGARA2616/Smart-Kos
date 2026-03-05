import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// =========================================================
// DATA DUMMY — Nantinya diganti dengan data dari database
// =========================================================

const SUMMARY_CARDS = [
    {
        title: "Total Pendapatan",
        value: "Rp 12.450.000",
        change: "+12%",
        changePositive: true,
        icon: "$",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
    },
    {
        title: "Tingkat Hunian",
        value: "85%",
        change: "+5%",
        changePositive: true,
        icon: "🛏",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
    },
    {
        title: "Kamar Kosong",
        value: "3 Kamar",
        change: "-2",
        changePositive: false,
        icon: "🔑",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
    },
    {
        title: "Perbaikan Tertunda",
        value: "4 Permintaan",
        change: "+1 Baru",
        changePositive: false,
        icon: "🔧",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
    },
];

const TRANSAKSI_TERBARU = [
    {
        id: "TRX-001",
        nama: "Sarah Connor",
        kamar: "304 (Deluxe)",
        tanggal: "24 Okt 2023",
        nominal: "Rp 2.200.000",
        status: "PAID" as const,
    },
    {
        id: "TRX-002",
        nama: "Michael Chen",
        kamar: "201 (Standard)",
        tanggal: "23 Okt 2023",
        nominal: "Rp 1.500.000",
        status: "PAID" as const,
    },
    {
        id: "TRX-003",
        nama: "Alex Johnson",
        kamar: "302 (Deluxe)",
        tanggal: "20 Okt 2023",
        nominal: "Rp 2.200.000",
        status: "UNPAID" as const,
    },
    {
        id: "TRX-004",
        nama: "Rina Pratiwi",
        kamar: "101 (Standard)",
        tanggal: "18 Okt 2023",
        nominal: "Rp 1.500.000",
        status: "OVERDUE" as const,
    },
    {
        id: "TRX-005",
        nama: "David Kim",
        kamar: "401 (Executive)",
        tanggal: "15 Okt 2023",
        nominal: "Rp 3.500.000",
        status: "PAID" as const,
    },
];

const DAFTAR_KAMAR = [
    { nomor: "101", tipe: "Standard", status: "TERISI" as const },
    { nomor: "102", tipe: "Standard", status: "PERBAIKAN" as const },
    { nomor: "201", tipe: "Standard", status: "TERISI" as const },
    { nomor: "202", tipe: "Standard", status: "KOSONG" as const },
    { nomor: "301", tipe: "Deluxe", status: "TERISI" as const },
    { nomor: "302", tipe: "Deluxe", status: "TERISI" as const },
    { nomor: "304", tipe: "Deluxe", status: "TERISI" as const },
    { nomor: "401", tipe: "Executive", status: "KOSONG" as const },
];

const AKTIVITAS_TERBARU = [
    { icon: "👤", text: "Sarah Connor ditambahkan ke Kamar 304", time: "2 jam yang lalu", color: "bg-blue-100 text-blue-600" },
    { icon: "💳", text: "Pembayaran Rp 850.000 dari Michael Chen diterima", time: "5 jam yang lalu", color: "bg-green-100 text-green-600" },
    { icon: "🔧", text: "Kran bocor dilaporkan di Kamar 102", time: "Kemarin", color: "bg-orange-100 text-orange-600" },
    { icon: "🚪", text: "David Kim melakukan checkout dari Kamar 205", time: "2 hari yang lalu", color: "bg-gray-100 text-gray-600" },
];

// Mapping badge variant untuk status transaksi
const statusBadgeMap: Record<string, "success" | "danger" | "warning"> = {
    PAID: "success",
    UNPAID: "warning",
    OVERDUE: "danger",
};
const statusLabelMap: Record<string, string> = {
    PAID: "Lunas",
    UNPAID: "Belum Bayar",
    OVERDUE: "Terlambat",
};

// Mapping badge variant untuk status kamar
const kamarBadgeMap: Record<string, "success" | "danger" | "warning" | "neutral"> = {
    TERISI: "success",
    KOSONG: "neutral",
    PERBAIKAN: "danger",
};

export default function AdminDashboardPage() {
    const today = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            {/* ========== TOP BAR ========== */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ringkasan Dasbor</h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Selamat datang kembali, Pemilik. Inilah yang terjadi hari ini.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                        📅 {today}
                    </span>
                    <button className="relative w-10 h-10 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
                        🔔
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-sm hover:bg-primary/25 transition-colors">
                        JA
                    </button>
                </div>
            </div>

            {/* ========== SUMMARY CARDS ========== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {SUMMARY_CARDS.map((card, idx) => (
                    <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardBody>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                                    <p className="text-2xl font-black text-gray-900">{card.value}</p>
                                </div>
                                <div className={`w-11 h-11 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center text-xl flex-shrink-0`}>
                                    {card.icon}
                                </div>
                            </div>
                            <p className={`text-xs font-semibold mt-3 flex items-center gap-1 ${card.changePositive ? "text-green-600" : "text-red-500"}`}>
                                <span>{card.changePositive ? "↑" : "↓"}</span>
                                {card.change} dari bulan lalu
                            </p>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* ========== MAIN GRID: TABEL + AKTIVITAS ========== */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Tabel Transaksi Terbaru (2/3 width) */}
                <div className="xl:col-span-2">
                    <Card className="border-none shadow-sm h-full">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold text-gray-900 text-base">Transaksi Terbaru</h2>
                            <a href="#" className="text-primary text-xs font-semibold hover:underline">Lihat semua →</a>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-left">
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Penghuni</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kamar</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nominal</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {TRANSAKSI_TERBARU.map((trx) => (
                                        <tr key={trx.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-gray-900">{trx.nama}</td>
                                            <td className="px-4 py-4 text-gray-600">{trx.kamar}</td>
                                            <td className="px-4 py-4 text-gray-500">{trx.tanggal}</td>
                                            <td className="px-4 py-4 font-semibold text-gray-900">{trx.nominal}</td>
                                            <td className="px-4 py-4">
                                                <Badge variant={statusBadgeMap[trx.status]}>
                                                    {statusLabelMap[trx.status]}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Aktivitas Terbaru (1/3 width) */}
                <div className="xl:col-span-1">
                    <Card className="border-none shadow-sm h-full">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold text-gray-900 text-base">Aktivitas Terbaru</h2>
                            <a href="#" className="text-primary text-xs font-semibold hover:underline">Lihat semua</a>
                        </div>
                        <CardBody className="space-y-4">
                            {AKTIVITAS_TERBARU.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className={`w-9 h-9 rounded-full ${item.color} flex items-center justify-center text-sm flex-shrink-0`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-800 font-medium leading-snug">{item.text}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* ========== STATUS KAMAR ========== */}
            <Card className="border-none shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 text-base">Ringkasan Status Kamar</h2>
                    <a href="/admin/kamar" className="text-primary text-xs font-semibold hover:underline">Kelola Semua Kamar →</a>
                </div>
                <CardBody>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {DAFTAR_KAMAR.map((kamar) => (
                            <div
                                key={kamar.nomor}
                                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-default"
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${kamar.status === "TERISI" ? "bg-green-100" :
                                        kamar.status === "PERBAIKAN" ? "bg-red-100" : "bg-gray-200"
                                    }`}>
                                    🛏
                                </div>
                                <p className="text-sm font-bold text-gray-900">No. {kamar.nomor}</p>
                                <p className="text-xs text-gray-500">{kamar.tipe}</p>
                                <Badge variant={kamarBadgeMap[kamar.status]} className="text-[10px] px-2 py-0.5">
                                    {kamar.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
