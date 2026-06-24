import { Card } from "@/components/ui/legacy-card";
import { Badge } from "@/components/ui/legacy-badge";
import { Button } from "@/components/ui/legacy-button";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { StatusKamar, Prisma as PrismaNamespace } from "@generated/prisma";
import { DoorOpen, BedDouble, Wrench, Pencil, Plus } from "lucide-react";

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

// Jumlah data kamar yang ditampilkan per halaman
const PAGE_SIZE = 10;

export default async function ManajemenKamarPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; status?: string; page?: string; sort?: string }>;
}) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    // Resolve searchParams (Next.js 15+)
    const resolvedParams = await searchParams;
    const query = resolvedParams?.query || "";
    const statusFilter = resolvedParams?.status as StatusKamar | undefined;
    const currentPage = Math.max(1, parseInt(resolvedParams?.page || "1", 10) || 1);
    const sort = resolvedParams?.sort || "";

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

    // Ambil semua kamar terfilter, lalu urutkan & paginasi di sini.
    // (nomor_kamar adalah string, jadi pengurutan numerik "terkecil → terbesar"
    //  dilakukan di JS dengan localeCompare numeric agar 2 < 10, bukan urutan abjad.)
    const allFiltered = await prisma.kamar.findMany({ where: whereCondition });

    const sortedKamar = [...allFiltered].sort((a, b) => {
        if (sort === "nomor_asc") return a.nomor_kamar.localeCompare(b.nomor_kamar, undefined, { numeric: true });
        if (sort === "nomor_desc") return b.nomor_kamar.localeCompare(a.nomor_kamar, undefined, { numeric: true });
        // Default: terbaru lebih dulu
        return b.createdAt.getTime() - a.createdAt.getTime();
    });

    const totalKamar = sortedKamar.length;
    const totalPages = Math.max(1, Math.ceil(totalKamar / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const dataKamar = sortedKamar.slice((safePage - 1) * PAGE_SIZE, (safePage - 1) * PAGE_SIZE + PAGE_SIZE);

    // Helper membangun URL halaman tujuan sambil mempertahankan filter aktif
    const buildPageHref = (p: number) => {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (statusFilter) params.set("status", statusFilter);
        if (sort) params.set("sort", sort);
        if (p > 1) params.set("page", String(p));
        const qs = params.toString();
        return qs ? `/admin/kamar?${qs}` : "/admin/kamar";
    };

    // Rentang baris yang sedang ditampilkan (untuk teks "Menampilkan x–y")
    const firstRow = totalKamar === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
    const lastRow = (safePage - 1) * PAGE_SIZE + dataKamar.length;

    // Fetch data mentah untuk menghitung statistik total keseluruhan (tanpa filter query pencarian)
    // agar kartu di atas tabel selalu menunjukkan angka riil.
    const allDataKamar = await prisma.kamar.findMany({ select: { status: true } });
    const totalKosong = allDataKamar.filter((k) => k.status === "KOSONG").length;
    const totalTerisi = allDataKamar.filter((k) => k.status === "TERISI").length;
    const totalPerbaikan = allDataKamar.filter((k) => k.status === "PERBAIKAN").length;

    const REKAP = [
        { label: "Kamar Kosong", value: totalKosong, Icon: DoorOpen, iconBg: "bg-[#E7F7EE]", iconColor: "text-[#16A572]" },
        { label: "Kamar Terisi", value: totalTerisi, Icon: BedDouble, iconBg: "bg-[#EAF0FF]", iconColor: "text-[#2F6BFF]" },
        { label: "Dalam Perbaikan", value: totalPerbaikan, Icon: Wrench, iconBg: "bg-[#FFF4E0]", iconColor: "text-[#F2A50C]" },
    ];

    return (
        <div className="p-6 lg:p-8 min-h-full">
            {/* Rekap Cepat */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {REKAP.map((r) => {
                    const Icon = r.Icon;
                    return (
                        <div key={r.label} className="bg-white rounded-2xl border border-[#EAEDF3] shadow-sm px-5 py-4 flex items-center gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${r.iconBg} ${r.iconColor}`}>
                                <Icon className="h-5 w-5" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-xs text-[#7B8597] font-medium">{r.label}</p>
                                <p className="text-2xl font-extrabold text-[#0E1424]">{r.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabel Kamar */}
            <Card>
                {/* Table Controls (Search & Filter via URL params) */}
                <div className="px-6 py-4 border-b border-[#EAEDF3] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <SearchFilterKamar />
                    <Link href="/admin/kamar/tambah" className="shrink-0">
                        <Button variant="primary" size="md" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 shadow-md shadow-[#2F6BFF]/20 font-semibold whitespace-nowrap">
                            <Plus className="h-4 w-4" strokeWidth={2.5} />
                            Tambah Kamar Baru
                        </Button>
                    </Link>
                </div>

                {dataKamar.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[#9AA3B4]">
                        <BedDouble className="h-12 w-12 mb-4 text-[#C9D0DC]" strokeWidth={1.5} />
                        <p className="font-semibold text-[#7B8597]">Tidak ada data kamar.</p>
                        {query || statusFilter ? (
                            <p className="text-sm mt-1">Gunakan kata kunci atau status lain untuk pencarian.</p>
                        ) : (
                            <p className="text-sm mt-1">Klik &quot;Tambah Kamar Baru&quot; untuk menambahkan unit pertama.</p>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#F9FAFC] text-left border-b border-[#EAEDF3]">
                                    <th className="px-6 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider w-20">Foto</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">No. Kamar</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Tipe Kamar</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Fasilitas</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Harga / Bulan</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F2F6]">
                                {dataKamar.map((kamar) => (
                                    <tr key={kamar.id} className="hover:bg-[#F4F6FA] transition-colors">
                                        {/* Thumbnail */}
                                        <td className="px-6 py-3">
                                            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#EAEDF3] bg-[#F4F6FA]">
                                                {kamar.foto_utama ? (
                                                    <Image
                                                        src={kamar.foto_utama}
                                                        alt={`Kamar ${kamar.nomor_kamar}`}
                                                        fill
                                                        className="object-cover"
                                                        sizes="56px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#C9D0DC]">
                                                        <BedDouble className="h-6 w-6" strokeWidth={1.5} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Nomor Kamar */}
                                        <td className="px-4 py-3">
                                            <span className="font-extrabold text-[#0E1424] text-base">#{kamar.nomor_kamar}</span>
                                        </td>

                                        {/* Tipe */}
                                        <td className="px-4 py-3 font-semibold text-[#384151]">{kamar.tipe}</td>

                                        {/* Fasilitas */}
                                        <td className="px-4 py-3 text-[#7B8597] text-xs max-w-xs leading-relaxed">{kamar.fasilitas}</td>

                                        {/* Harga */}
                                        <td className="px-4 py-3 font-bold text-[#0E1424]">
                                            Rp {kamar.harga_per_bulan.toLocaleString("id-ID")}
                                            <span className="font-normal text-[#9AA3B4] text-xs">/bln</span>
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
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF0FF] text-[#2F6BFF] hover:bg-[#2F6BFF] hover:text-white transition-colors"
                                                    >
                                                        <Pencil className="h-4 w-4" strokeWidth={2} />
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
                <div className="px-6 py-4 border-t border-[#EAEDF3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-xs text-[#7B8597]">
                        Menampilkan <strong className="text-[#384151]">{firstRow}–{lastRow}</strong> dari{" "}
                        <strong className="text-[#384151]">{totalKamar}</strong> data terfilter
                    </p>
                    <div className="flex items-center gap-1">
                        {safePage > 1 ? (
                            <Link
                                href={buildPageHref(safePage - 1)}
                                className="px-3 py-1.5 rounded-lg border border-[#EAEDF3] text-xs text-[#7B8597] hover:bg-[#F4F6FA]"
                            >
                                Prev
                            </Link>
                        ) : (
                            <button className="px-3 py-1.5 rounded-lg border border-[#EAEDF3] text-xs text-[#7B8597] opacity-40 cursor-not-allowed" disabled>
                                Prev
                            </button>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
                            p === safePage ? (
                                <button key={p} className="px-3 py-1.5 rounded-lg bg-[#2F6BFF] text-white text-xs font-semibold min-w-[32px]">
                                    {p}
                                </button>
                            ) : (
                                <Link
                                    key={p}
                                    href={buildPageHref(p)}
                                    className="px-3 py-1.5 rounded-lg border border-[#EAEDF3] text-xs text-[#7B8597] hover:bg-[#F4F6FA] min-w-[32px] text-center"
                                >
                                    {p}
                                </Link>
                            )
                        )}

                        {safePage < totalPages ? (
                            <Link
                                href={buildPageHref(safePage + 1)}
                                className="px-3 py-1.5 rounded-lg border border-[#EAEDF3] text-xs text-[#7B8597] hover:bg-[#F4F6FA]"
                            >
                                Next
                            </Link>
                        ) : (
                            <button className="px-3 py-1.5 rounded-lg border border-[#EAEDF3] text-xs text-[#7B8597] opacity-40 cursor-not-allowed" disabled>
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
