import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import CheckoutForm from "./CheckoutForm";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function PesanKamarPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== "USER") {
        redirect("/login");
    }

    const { id } = await params;

    const kamar = await prisma.kamar.findUnique({
        where: { id }
    });

    if (!kamar || kamar.status !== "KOSONG") {
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
            <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-primary mb-6 inline-flex items-center gap-1.5 transition-colors">
                ← Kembali ke Daftar Kamar
            </Link>

            <h1 className="text-3xl font-black text-gray-900 mb-8 mt-2">Selesaikan Pemesanan</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Detail Kamar (Kiri di Desktop, Atas di Mobile) */}
                <div className="lg:col-span-5 h-fit order-2 lg:order-1">
                    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                        {kamar.foto_utama && (
                            <div className="relative w-full h-48 bg-gray-200">
                                <Image src={kamar.foto_utama} alt={kamar.tipe} fill className="object-cover" />
                            </div>
                        )}
                        <CardBody className="p-6">
                            <h2 className="text-sm uppercase tracking-widest font-bold text-gray-500 mb-4 border-b border-gray-100 pb-3">Ringkasan Pesanan</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Tipe Kamar</span>
                                    <span className="font-bold text-gray-900 text-right">{kamar.tipe}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Nomor Unit</span>
                                    <span className="font-bold text-gray-900 px-3 py-1 bg-gray-100 rounded-md text-sm">#{kamar.nomor_kamar}</span>
                                </div>
                                <div className="pt-4 mt-2 border-t border-dashed border-gray-200">
                                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                                        <p className="text-primary font-bold text-sm mb-1 uppercase">Total Tagihan (Bulan 1)</p>
                                        <p className="font-black text-gray-900 text-3xl">Rp {kamar.harga_per_bulan.toLocaleString("id-ID")}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 text-center items-center">Harga sudah termasuk air dan maintenance.</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Form Pembayaran (Kanan di Desktop, Bawah di Mobile) */}
                <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                    <Card className="border border-gray-200 shadow-md shadow-gray-100">
                        <CardBody className="p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Instruksi Pembayaran</h2>

                            <div className="mb-8">
                                <p className="text-[15px] text-gray-600 mb-3 block">1. Silakan transfer sesuai nominal Tagihan Anda ke rekening Bank berikut:</p>
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-xs text-white bg-blue-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">BCA</span>
                                            <p className="text-sm font-semibold text-gray-600">Bank Central Asia</p>
                                        </div>
                                        <p className="text-3xl font-black text-gray-900 font-mono tracking-widest mt-1">8732 100 200</p>
                                        <p className="text-sm font-medium text-gray-600 mt-1">a.n. PT SmartKos Indonesia</p>
                                    </div>
                                    <Button variant="secondary" className="border-gray-300 text-sm whitespace-nowrap bg-white text-gray-700 hover:text-black hover:border-black">
                                        Salin Nomor
                                    </Button>
                                </div>
                            </div>

                            <div className="mb-8 pt-6 border-t border-dashed border-gray-200">
                                <p className="text-[15px] font-semibold text-gray-800 mb-4 text-center md:text-left">2. Atau scan QRIS dari semua E-Wallet:</p>
                                <div className="flex justify-center md:justify-start">
                                    <div className="w-56 h-56 bg-slate-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-3">
                                        <Image
                                            src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                                            alt="QRIS Demo" width={160} height={160} className="opacity-90 grayscale contrast-150"
                                        />
                                        <span className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wider">Demo QR Tuju</span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="border border-gray-200 shadow-xl shadow-primary/5">
                        <CardBody className="p-8 bg-blue-50/20 overflow-hidden">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Unggah Bukti Transaksi</h2>
                            <p className="text-sm text-gray-500 mb-6">Pastikan tanggal dan nominal transfer terlihat jelas untuk mempercepat proses verifikasi.</p>
                            <CheckoutForm kamarId={kamar.id} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
