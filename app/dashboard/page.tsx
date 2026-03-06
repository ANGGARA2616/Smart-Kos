import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) return null;

    // Fetch user with their current assigned room (if any)
    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { kamar: true }
    });

    // Check existing bookings
    const activeBooking = await prisma.booking.findFirst({
        where: { user_id: session.userId },
        orderBy: { createdAt: "desc" },
        include: { kamar: true }
    });

    const approvedBooking = await prisma.booking.findFirst({
        where: { user_id: session.userId, status: "APPROVED" },
        orderBy: { createdAt: "desc" }
    });

    // ==========================================
    // 1. IS PENGHUNI (Has officially occupied a room)
    // ==========================================
    if (user?.status === "PENGHUNI" && user.kamar) {
        const tanggalMasuk = approvedBooking
            ? approvedBooking.createdAt.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })
            : "Data tidak tersedia";

        return (
            <div className="max-w-4xl mx-auto mt-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Penghuni</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola kamar Anda dan laporkan kendala secara mudah.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Info Kamar Card */}
                    <Card className="shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-32 bg-gray-200 relative">
                            {user.kamar.foto_utama ? (
                                <Image src={user.kamar.foto_utama} alt={user.kamar.tipe} fill className="object-cover" />
                            ) : (
                                <div className="absolute inset-0 bg-primary/20 flex justify-center items-center text-primary/50 text-4xl">🛏</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex flex-col justify-end p-5">
                                <span className="text-white font-bold text-xl">Kamar #{user.kamar.nomor_kamar}</span>
                            </div>
                        </div>
                        <CardBody className="p-6">
                            <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Informasi Sewa</h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5 font-medium">Tipe Kamar</p>
                                    <p className="text-sm font-semibold text-gray-900">{user.kamar.tipe}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5 font-medium">Harga / Bulan</p>
                                    <p className="text-sm font-bold text-primary">Rp {user.kamar.harga_per_bulan.toLocaleString('id-ID')}</p>
                                </div>
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-0.5 font-medium">Tanggal Masuk (Disetujui)</p>
                                    <p className="text-sm font-semibold text-gray-900">{tanggalMasuk}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Quick Access Card */}
                    <div className="space-y-6">
                        <Card className="shadow-md shadow-primary/5 border border-primary/20 bg-blue-50/30">
                            <CardBody className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[160px]">
                                <span className="text-4xl mb-3">🔧</span>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Ada Masalah dengan Kamar?</h3>
                                <p className="text-xs text-gray-500 mb-5">Laporkan kerusakan fasilitas seperti AC, Air, atau pintu agar segera kami perbaiki.</p>

                                <Link href="/dashboard/lapor-kerusakan" className="w-full">
                                    <Button variant="primary" className="w-full font-bold shadow-md shadow-primary/20">
                                        Lapor Kerusakan
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>

                        <Card className="shadow-sm border border-gray-100">
                            <CardBody className="p-6 flex flex-col items-center justify-center text-center">
                                <span className="text-3xl mb-3">👨‍💼</span>
                                <h3 className="text-base font-bold text-gray-900 mb-2">Hubungi Pengelola</h3>
                                <p className="text-xs text-gray-500 mb-4">Chat kami via WhatsApp jika ada pertanyaan terkait administrasi atau perpanjangan.</p>
                                <Button variant="secondary" className="w-full border-gray-300 text-sm font-semibold">
                                    Chat WhatsApp
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // 2. HAS PENDING BOOKING
    // ==========================================
    if (activeBooking && activeBooking.status === "PENDING") {
        return (
            <div className="max-w-xl mx-auto text-center mt-20 bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
                <span className="text-6xl mb-6 block">⏳</span>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Menunggu Konfirmasi Admin</h1>
                <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                    Terima kasih! Bukti pembayaran Anda untuk kamar <strong>{activeBooking.kamar.tipe} (No. {activeBooking.kamar.nomor_kamar})</strong> sedang kami verifikasi. Proses verifikasi manual memakan waktu 1x24 jam.
                </p>
                <div className="bg-orange-50 text-orange-700 p-4 rounded-xl text-sm font-semibold border border-orange-200 inline-block px-8 py-3 w-full uppercase tracking-wider">
                    Status Pesanan: PENDING REVIEW
                </div>
            </div>
        );
    }

    // ==========================================
    // 3. HAS REJECTED BOOKING / DEFAULT CATALOG
    // ==========================================
    let rejectedMessage = null;
    if (activeBooking && activeBooking.status === "REJECTED") {
        rejectedMessage = "Mohon maaf, bukti pembayaran Anda sebelumnya ditolak. Silakan melakukan pemesanan ulang untuk memilih kamar.";
    }

    // SHOW AVAILABLE ROOMS
    const dataKamar = await prisma.kamar.findMany({
        where: { status: "KOSONG" },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div>
            <div className="mb-10 mt-6">
                <h1 className="text-3xl font-bold text-gray-900">Pilih Kamar Impianmu</h1>
                <p className="text-gray-500 text-sm mt-2">Silakan pilih kamar yang masih kosong untuk mulai menyewa dan ajukan bukti transfer Anda.</p>
                {rejectedMessage && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold flex items-center gap-2">
                        <span>⚠️</span> {rejectedMessage}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dataKamar.length === 0 ? (
                    <div className="col-span-3 text-center text-gray-400 py-20 bg-white border border-dashed rounded-3xl border-gray-300">
                        <span className="text-5xl block mb-4">🛏️</span>
                        <p className="font-semibold text-lg text-gray-500">Maaf, saat ini seluruh kamar sedang penuh.</p>
                        <p className="text-sm">Silakan cek secara berkala.</p>
                    </div>
                ) : dataKamar.map((room) => (
                    <Card
                        key={room.id}
                        className="flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden border border-gray-100"
                    >
                        <div className="relative w-full h-52 group overflow-hidden bg-gray-200 flex items-center justify-center text-gray-400">
                            {room.foto_utama ? (
                                <Image
                                    src={room.foto_utama}
                                    alt={room.tipe}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : <span>Tanpa Foto</span>}

                            <Badge
                                variant="success"
                                className="absolute top-3 right-3 shadow text-xs font-bold tracking-wide"
                            >
                                KOSONG
                            </Badge>
                        </div>

                        <CardBody className="flex flex-col flex-grow bg-white">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{room.tipe}</h3>
                            <div className="text-sm font-semibold text-primary mb-2">No Kamar: #{room.nomor_kamar}</div>

                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-2xl font-black text-gray-900">Rp {room.harga_per_bulan.toLocaleString('id-ID')}</span>
                                <span className="text-sm text-gray-500 font-normal">/bulan</span>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-700 font-medium mb-6 flex-grow">
                                {room.fasilitas.split(",").map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <span className="text-primary text-base">✓</span>
                                        {feature.trim()}
                                    </li>
                                ))}
                            </ul>

                            <Link href={`/dashboard/pesan/${room.id}`} className="w-full inline-block">
                                <Button variant="primary" className="w-full py-2.5 text-sm font-semibold rounded-lg text-center font-bold">
                                    Sewa Kamar Ini
                                </Button>
                            </Link>

                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}
