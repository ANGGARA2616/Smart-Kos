import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { StatusKamar, Prisma as PrismaNamespace } from "@generated/prisma";

import SearchFilterKamar from "@/components/admin/SearchFilterKamar";
import DeleteKamarButton from "@/components/admin/DeleteKamarButton";

// Forza rendering dinamis saat runtime agar tidak melakukan DB call saat build-time
export const dynamic = "force-dynamic";

// Mapping status kamar ke varian Badge
const statusBadgeMap: Record<StatusKamar, "success" | "danger" | "warning"> = {
    KOSONG: "success",
    TERISI: "danger",
    PERBAIKAN: "warning",
};

export default async function ManajemenKamarPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; status?: string }>;
}) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    // Resolve searchParams (Next.js 15+)
    const resolvedParams = await searchParams;
    const query = resolvedParams?.query || "";
    const statusFilter = resolvedParams?.status as StatusKamar | undefined;

    // Membangun kondisi pencarian berdasarkan URL query parameter
    const whereCondition: PrismaNamespace.KamarWhereInput = {};
    if (query) {
        whereCondition.OR = [
            { nomor_kamar: { contains: query, mode: "insensitive" } },
            { tipe: { contains: query, mode: "insensitive" } },
        ];
    }
    if (statusFilter) {
        whereCondition.status = statusFilter;
    }

    // Fetch data yang sudah difilter
    const dataKamar = await prisma.kamar.findMany({
        where: whereCondition,
        orderBy: { createdAt: "desc" },
    });

    // Fetch data mentah untuk menghitung statistik total keseluruhan (tanpa filter query pencarian)
    // agar kartu di atas tabel selalu menunjukkan angka riil.
    const allDataKamar = await prisma.kamar.findMany({ select: { status: true } });
    const totalKosong = allDataKamar.filter((k) => k.status === "KOSONG").length;
    const totalTerisi = allDataKamar.filter((k) => k.status === "TERISI").length;
    const totalPerbaikan = allDataKamar.filter((k) => k.status === "PERBAIKAN").length;

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Kamar</h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Kelola data, foto, dan status seluruh unit kamar.
                    </p>
                </div>
                <Link href="/admin/kamar/tambah">
                    <Button variant="primary" size="md" className="shadow-md shadow-primary/20 font-semibold">
                        + Tambah Kamar Baru
                    </Button>
                </Link>
            </div>

            {/* Rekap Cepat */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-xl">🟢</div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Kamar Kosong</p>
                        <p className="text-2xl font-black text-gray-900">{totalKosong}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-500 flex items-center justify-center text-xl">🔴</div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Kamar Terisi</p>
                        <p className="text-2xl font-black text-gray-900">{totalTerisi}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl">🔧</div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Dalam Perbaikan</p>
                        <p className="text-2xl font-black text-gray-900">{totalPerbaikan}</p>
                    </div>
                </div>
            </div>

            {/* Tabel Kamar */}
            <Card className="border-none shadow-sm overflow-hidden">
                {/* Table Controls (Search & Filter via URL params) */}
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h2 className="font-bold text-gray-900 text-base whitespace-nowrap">
                        Daftar Kamar ({dataKamar.length} ditemukan)
                    </h2>
                    <SearchFilterKamar />
                </div>

                {dataKamar.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <span className="text-5xl mb-4">🛏</span>
                        <p className="font-semibold text-gray-500">Tidak ada data kamar.</p>
                        {query || statusFilter ? (
                            <p className="text-sm mt-1">Gunakan kata kunci atau status lain untuk pencarian.</p>
                        ) : (
                            <p className="text-sm mt-1">Klik &quot;+ Tambah Kamar Baru&quot; untuk menambahkan unit pertama.</p>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left border-b border-gray-100">
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Foto</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Kamar</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipe Kamar</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fasilitas</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga / Bulan</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {dataKamar.map((kamar) => (
                                    <tr key={kamar.id} className="hover:bg-slate-50/70 transition-colors">
                                        {/* Thumbnail */}
                                        <td className="px-6 py-3">
                                            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-100 bg-gray-100">
                                                {kamar.foto_utama ? (
                                                    <Image
                                                        src={kamar.foto_utama}
                                                        alt={`Kamar ${kamar.nomor_kamar}`}
                                                        fill
                                                        className="object-cover"
                                                        sizes="56px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🛏</div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Nomor Kamar */}
                                        <td className="px-4 py-3">
                                            <span className="font-black text-gray-900 text-base">#{kamar.nomor_kamar}</span>
                                        </td>

                                        {/* Tipe */}
                                        <td className="px-4 py-3 font-semibold text-gray-800">{kamar.tipe}</td>

                                        {/* Fasilitas */}
                                        <td className="px-4 py-3 text-gray-500 text-xs max-w-xs leading-relaxed">{kamar.fasilitas}</td>

                                        {/* Harga */}
                                        <td className="px-4 py-3 font-bold text-gray-900">
                                            Rp {kamar.harga_per_bulan.toLocaleString("id-ID")}
                                            <span className="font-normal text-gray-400 text-xs">/bln</span>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-4 py-3">
                                            <Badge variant={statusBadgeMap[kamar.status]}>
                                                {kamar.status}
                                            </Badge>
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={`/admin/kamar/${kamar.id}/edit`}>
                                                    <button
                                                        title="Edit"
                                                        className="w-8 h-8 rounded-lg bg-blue-50 text-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center text-sm"
                                                    >
                                                        ✏️
                                                    </button>
                                                </Link>
                                                <DeleteKamarButton id={kamar.id} nomor_kamar={kamar.nomor_kamar} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        Menampilkan <strong className="text-gray-700">1–{dataKamar.length}</strong> dari{" "}
                        <strong className="text-gray-700">{dataKamar.length}</strong> data terfilter
                    </p>
                    <div className="flex items-center gap-1">
                        <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-40" disabled>
                            ← Prev
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold">1</button>
                        <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-40" disabled>
                            Next →
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
