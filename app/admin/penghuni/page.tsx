import { Card } from "@/components/ui/legacy-card";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SearchPenghuni from "@/components/admin/SearchPenghuni";
import TambahPenghuniForm from "@/components/admin/TambahPenghuniForm";
import HapusPenghuniButton from "@/components/admin/HapusPenghuniButton";
import type { Prisma as PrismaNamespace } from "@generated/prisma";
import { Users, Phone, MessageCircle, BedDouble } from "lucide-react";

export const dynamic = "force-dynamic";

// Jumlah data penghuni yang ditampilkan per halaman
const PAGE_SIZE = 10;

export default async function DataPenghuniPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; page?: string }>;
}) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    const resolvedParams = await searchParams;
    const query = resolvedParams?.query || "";
    const currentPage = Math.max(1, parseInt(resolvedParams?.page || "1", 10) || 1);

    const whereCondition: PrismaNamespace.UserWhereInput = {
        status: "PENGHUNI",
    };

    if (query) {
        whereCondition.OR = [
            { nama: { contains: query, mode: "insensitive" } },
            { kamar: { nomor_kamar: { contains: query, mode: "insensitive" } } },
        ];
    }

    // Total data terfilter untuk perhitungan pagination
    const totalPenghuni = await prisma.user.count({ where: whereCondition });
    const totalPages = Math.max(1, Math.ceil(totalPenghuni / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);

    // Ambil user PENGHUNI untuk halaman saat ini (maks. PAGE_SIZE baris)
    const penghunis = await prisma.user.findMany({
        where: whereCondition,
        include: {
            kamar: true,
            bookings: {
                where: { status: "APPROVED" },
                orderBy: { createdAt: "desc" },
                take: 1
            }
        },
        orderBy: { nama: "asc" },
        skip: (safePage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
    });

    // Helper membangun URL halaman tujuan sambil mempertahankan pencarian aktif
    const buildPageHref = (p: number) => {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (p > 1) params.set("page", String(p));
        const qs = params.toString();
        return qs ? `/admin/penghuni?${qs}` : "/admin/penghuni";
    };

    // Rentang baris yang sedang ditampilkan (untuk teks "Menampilkan x–y")
    const firstRow = totalPenghuni === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
    const lastRow = (safePage - 1) * PAGE_SIZE + penghunis.length;

    // Penanda waktu untuk status masa sewa (dihitung sekali, bukan per-baris)
    const now = new Date();
    const batasSegera = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 hari ke depan

    // Kamar kosong untuk form tambah penghuni manual
    const kamarKosong = await prisma.kamar.findMany({
        where: { status: "KOSONG" },
        orderBy: { nomor_kamar: "asc" },
        select: { id: true, nomor_kamar: true, tipe: true, harga_per_bulan: true }
    });

    return (
        <div className="p-6 lg:p-8 min-h-full">
            <Card>
                <div className="px-6 py-4 border-b border-[#EAEDF3] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <SearchPenghuni />
                    <div className="shrink-0">
                        <TambahPenghuniForm kamarKosong={kamarKosong} />
                    </div>
                </div>

                {penghunis.length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center text-[#9AA3B4]">
                        <Users className="h-12 w-12 mb-4 text-[#C9D0DC]" strokeWidth={1.5} />
                        <p className="font-semibold text-[#7B8597]">Tidak ada penghuni yang ditemukan.</p>
                        {query && (
                            <p className="text-sm mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#F9FAFC] text-left border-b border-[#EAEDF3]">
                                    <th className="px-6 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Nama & Kontak</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Kamar Ditempati</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Tanggal Mulai Sewa</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider">Sewa Berakhir</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-[#9AA3B4] uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F2F6]">
                                {penghunis.map((p) => {
                                    const booking = p.bookings[0];
                                    const tanggalMasuk = booking
                                        ? booking.createdAt.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })
                                        : "Tidak terekam";

                                    const tanggalBerakhir = booking?.tanggal_berakhir
                                        ? booking.tanggal_berakhir.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })
                                        : "Belum diatur";

                                    // Cek apakah sewa sudah/hampir habis
                                    const isExpired = booking?.tanggal_berakhir && booking.tanggal_berakhir < now;
                                    const isExpiringSoon = booking?.tanggal_berakhir && !isExpired &&
                                        booking.tanggal_berakhir < batasSegera; // <30 hari

                                    return (
                                        <tr key={p.id} className="hover:bg-[#F4F6FA] transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-[#0E1424] text-base">{p.nama}</p>
                                                <p className="text-xs text-[#7B8597] flex items-center gap-1.5 mt-0.5">
                                                    <Phone className="h-3 w-3" strokeWidth={2} /> {p.no_hp}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {p.kamar ? (
                                                    <div>
                                                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-[#EAF0FF] text-[#2F6BFF] font-extrabold rounded text-sm">
                                                            #{p.kamar.nomor_kamar}
                                                        </span>
                                                        <span className="text-xs text-[#7B8597] ml-2 font-medium">{p.kamar.tipe}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs italic text-[#9AA3B4]">Belum ada kamar</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-[#7B8597] font-medium">
                                                {tanggalMasuk}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-semibold ${
                                                    isExpired
                                                        ? 'text-[#E5484D]'
                                                        : isExpiringSoon
                                                        ? 'text-[#B7791F]'
                                                        : 'text-[#384151]'
                                                }`}>
                                                    {tanggalBerakhir}
                                                </span>
                                                {isExpired && (
                                                    <span className="ml-2 text-[10px] font-bold bg-[#FDECEC] text-[#E5484D] px-2 py-0.5 rounded-full">HABIS</span>
                                                )}
                                                {isExpiringSoon && (
                                                    <span className="ml-2 text-[10px] font-bold bg-[#FFF4E0] text-[#B7791F] px-2 py-0.5 rounded-full">SEGERA</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <a
                                                        href={`https://wa.me/${p.no_hp.replace(/^0/, "62")}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Chat WhatsApp"
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CFEBD9] bg-[#E7F7EE] text-[#16A572] hover:bg-[#16A572] hover:text-white transition-colors"
                                                    >
                                                        <MessageCircle className="h-4 w-4" strokeWidth={2} />
                                                    </a>
                                                    <Link href={`/admin/kamar/${p.kamar?.id}/edit?from=penghuni`} title="Lihat Detail Kamar" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D4E1FF] bg-[#EAF0FF] text-[#2F6BFF] hover:bg-[#2F6BFF] hover:text-white transition-colors">
                                                        <BedDouble className="h-4 w-4" strokeWidth={2} />
                                                    </Link>
                                                    <HapusPenghuniButton userId={p.id} nama={p.nama} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-[#EAEDF3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-xs text-[#7B8597]">
                        Menampilkan <strong className="text-[#384151]">{firstRow}–{lastRow}</strong> dari{" "}
                        <strong className="text-[#384151]">{totalPenghuni}</strong> penghuni
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
