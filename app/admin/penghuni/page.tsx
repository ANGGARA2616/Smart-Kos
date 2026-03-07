import { Card } from "@/components/ui/Card";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SearchPenghuni from "@/components/admin/SearchPenghuni";
import type { Prisma as PrismaNamespace } from "@generated/prisma";

export const dynamic = "force-dynamic";

export default async function DataPenghuniPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    const resolvedParams = await searchParams;
    const query = resolvedParams?.query || "";

    // Membangun kondisi pencarian berdasarkan URL query parameter
    // Hanya ambil User yang statusnya PENGHUNI
    const whereCondition: PrismaNamespace.UserWhereInput = {
        status: "PENGHUNI",
    };

    if (query) {
        whereCondition.OR = [
            { nama: { contains: query, mode: "insensitive" } },
            // Mencari juga berdasarkan relasi kamar
            { kamar: { nomor_kamar: { contains: query, mode: "insensitive" } } },
        ];
    }

    // Ambil semua user PENGHUNI dan joinkan pesanan yg APPROVED untuk tau tanggal masuk
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
        orderBy: { nama: "asc" }
    });

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Data Penghuni Aktif</h1>
                <p className="text-gray-500 text-sm mt-0.5">Daftar pengguna yang sudah resmi menyewa dan menempati kamar saat ini.</p>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h2 className="font-bold text-gray-900 text-base whitespace-nowrap">
                        Total Penghuni ({penghunis.length})
                    </h2>
                    <SearchPenghuni />
                </div>

                {penghunis.length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center text-gray-400">
                        <span className="text-5xl mb-4 text-gray-300">👥</span>
                        <p className="font-semibold text-gray-600">Tidak ada penghuni yang ditemukan.</p>
                        {query && (
                            <p className="text-sm mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left border-b border-gray-100">
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama & Kontak</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kamar Ditempati</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Mulai Sewa</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {penghunis.map((p) => {
                                    // Ambil tanggal mulai dari booking pertama yg di approve
                                    const tanggalMasuk = p.bookings[0]
                                        ? p.bookings[0].createdAt.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })
                                        : "Tidak terekam";

                                    return (
                                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900 text-base">{p.nama}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                                                    <span>📱</span> {p.no_hp}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {p.kamar ? (
                                                    <div>
                                                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-primary/10 text-primary font-black rounded text-sm">
                                                            #{p.kamar.nomor_kamar}
                                                        </span>
                                                        <span className="text-xs text-gray-500 ml-2 font-medium">{p.kamar.tipe}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs italic text-gray-400">Belum ada kamar</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 font-medium">
                                                {tanggalMasuk}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <a
                                                        href={`https://wa.me/${p.no_hp.replace(/^0/, "62")}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Chat WhatsApp"
                                                        className="w-8 h-8 rounded border border-green-200 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center text-sm"
                                                    >
                                                        💬
                                                    </a>
                                                    <Link href={`/admin/kamar/${p.kamar?.id}/edit?from=penghuni`} title="Lihat Detail Kamar" className="w-8 h-8 rounded border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center text-sm">
                                                        🛏
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
