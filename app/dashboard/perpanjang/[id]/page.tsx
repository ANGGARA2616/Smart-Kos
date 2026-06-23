import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Card, CardBody } from "@/components/ui/legacy-card";
import CheckoutForm from "@/app/dashboard/pesan/[id]/CheckoutForm";
import Link from "next/link";
import Image from "next/image";
import CopyButton from "@/components/CopyButton";

export const dynamic = "force-dynamic";

export default async function PerpanjangKamarPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== "USER") {
        redirect("/login");
    }

    const { id } = await params;

    // Pastikan user ini benar-benar PENGHUNI kamar ini
    const user = await prisma.user.findUnique({
        where: { id: session.userId }
    });

    if (!user || user.status !== "PENGHUNI" || user.kamar_id !== id) {
        redirect("/dashboard");
    }

    const kamar = await prisma.kamar.findUnique({
        where: { id }
    });

    const kostProfile = await prisma.kostProfile.findFirst();

    if (!kamar) {
        notFound();
    }

    // Hindari pesan dua kali jika sedang pending
    const existing = await prisma.booking.findFirst({
        where: { user_id: session.userId, status: "PENDING" }
    });
    if (existing) {
        redirect("/dashboard");
    }

    return (
        <div className="max-w-4xl mx-auto py-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg border border-[#D4E1FF] bg-white px-4 py-2 text-sm font-semibold text-[#2F6BFF] shadow-sm transition-colors hover:bg-[#EAF0FF] mb-6">
                Kembali ke Dashboard
            </Link>

            <h1 className="text-3xl font-black text-gray-900 mb-8 mt-2">Perpanjang Masa Sewa</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Detail Kamar (Kiri di Desktop, Atas di Mobile) */}
                <div className="lg:col-span-5 h-fit order-2 lg:order-1">
                    <Card className="border border-[#EAEDF3] shadow-sm rounded-2xl overflow-hidden">
                        {kamar.foto_utama && (
                            <div className="relative w-full h-48 bg-[#EAEDF3]">
                                <Image src={kamar.foto_utama} alt={kamar.tipe} fill className="object-cover" />
                            </div>
                        )}
                        <CardBody className="p-6">
                            <h2 className="text-sm uppercase tracking-widest font-bold text-gray-500 mb-4 border-b border-[#EAEDF3] pb-3">Kamar Saat Ini</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Tipe Kamar</span>
                                    <span className="font-bold text-gray-900 text-right">{kamar.tipe}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Nomor Unit</span>
                                    <span className="font-bold text-gray-900 px-3 py-1 bg-gray-100 rounded-md text-sm">#{kamar.nomor_kamar}</span>
                                </div>
                                <div className="pt-4 mt-2 border-t border-dashed border-[#EAEDF3]">
                                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                                        <p className="text-primary font-bold text-sm mb-1 uppercase">Harga Per Bulan</p>
                                        <p className="font-black text-gray-900 text-3xl">Rp {kamar.harga_per_bulan.toLocaleString("id-ID")}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 text-center items-center">Sisa hari yang belum habis tidak akan hangus.</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Form Pembayaran (Kanan di Desktop, Bawah di Mobile) */}
                <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                    <Card className="border border-[#EAEDF3] shadow-md shadow-gray-100">
                        <CardBody className="p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Instruksi Pembayaran</h2>

                            <div className="mb-8">
                                <p className="text-[15px] text-gray-600 mb-3 block">1. Silakan transfer sesuai Tagihan Perpanjangan ke rekening:</p>
                                <div className="bg-[#F9FAFC] p-5 rounded-xl border border-[#EAEDF3] flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-xs text-white bg-[#2F6BFF] px-2 py-0.5 rounded uppercase font-bold tracking-wider">{kostProfile?.nama_bank || "BCA"}</span>
                                            <p className="text-sm font-semibold text-gray-600">Transfer Bank</p>
                                        </div>
                                        <p className="text-2xl font-black text-gray-900 font-mono tracking-widest mt-1">{kostProfile?.nomor_rekening || "1234 5678 90"}</p>
                                        <p className="text-[13px] font-bold text-gray-500 mt-0.5 bg-[#EAEDF3]/50 inline-block px-2 py-0.5 rounded text-gray-600">a.n. {kostProfile?.nama_pemilik_rekening || "PT SmartKos Indonesia"}</p>
                                    </div>
                                    <CopyButton textToCopy={kostProfile?.nomor_rekening || "1234567890"} />
                                </div>
                            </div>

                            <div className="mb-8 pt-6 border-t border-dashed border-[#EAEDF3]">
                                <p className="text-[15px] font-semibold text-gray-800 mb-4 text-center md:text-left">2. Atau scan QRIS dari semua E-Wallet:</p>
                                <div className="flex justify-center md:justify-start">
                                    <div className="w-56 h-56 bg-[#F4F6FA] rounded-2xl border-2 border-dashed border-[#D4DAE3] flex flex-col items-center justify-center p-3 relative overflow-hidden">
                                        <Image
                                            src={kostProfile?.foto_qris || "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"}
                                            alt="QRIS Pembayaran" width={160} height={160} className={kostProfile?.foto_qris ? "w-full h-full object-contain" : "opacity-90 grayscale contrast-150"}
                                        />
                                        {!kostProfile?.foto_qris && <span className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wider">Demo QR Tuju</span>}
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="border border-[#EAEDF3] shadow-xl shadow-primary/5">
                        <CardBody className="p-8 bg-[#FFF8EC] overflow-hidden">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Pilih Durasi & Unggah Bukti</h2>
                            <p className="text-sm text-gray-500 mb-5">Pilih siklus perpanjangan sewa Anda dan unggah bukti pembayarannya. Verifikasi butuh waktu maksimal 1x24 jam.</p>
                            <CheckoutForm kamarId={kamar.id} hargaPerBulan={kamar.harga_per_bulan} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
