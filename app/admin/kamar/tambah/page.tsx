import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import type { StatusKamar } from "@generated/prisma";

export default function TambahKamarPage() {
    // Server Action untuk memproses form
    async function tambahKamar(formData: FormData) {
        "use server";

        // Ambil data dari form
        const nomor_kamar = formData.get("nomor_kamar") as string;
        const tipe = formData.get("tipe") as string;
        const harga_per_bulan = parseInt(formData.get("harga_per_bulan") as string, 10);
        const status = formData.get("status") as StatusKamar;
        const fasilitas = formData.get("fasilitas") as string;

        // Validasi dasar
        if (!nomor_kamar || !tipe || !harga_per_bulan || !status || !fasilitas) {
            throw new Error("Semua kolom harus diisi!");
        }

        // Insert ke PostgreSQL via Prisma
        await prisma.kamar.create({
            data: {
                nomor_kamar,
                tipe,
                harga_per_bulan,
                status,
                fasilitas,
                // Foto default sementara jika diperlukan
                foto_utama: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=200&auto=format&fit=crop",
            },
        });

        // Hapus cache halaman daftar kamar dan kembali ke sana
        revalidatePath("/admin/kamar");
        redirect("/admin/kamar");
    }

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/kamar" className="text-sm text-gray-500 hover:text-primary mb-2 inline-flex items-center gap-1 font-medium">
                    ← Kembali ke Daftar Kamar
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">Tambah Kamar Baru</h1>
                <p className="text-gray-500 text-sm mt-0.5">
                    Masukkan detail informasi untuk unit kamar baru.
                </p>
            </div>

            {/* Form Card */}
            <div className="max-w-3xl">
                <Card className="border-none shadow-sm">
                    <CardBody className="p-8">
                        <form action={tambahKamar} className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nomor Kamar */}
                                <div className="space-y-2">
                                    <label htmlFor="nomor_kamar" className="block text-sm font-semibold text-gray-700">
                                        Nomor Kamar <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="nomor_kamar"
                                        name="nomor_kamar"
                                        required
                                        placeholder="Contoh: 105"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                                    />
                                </div>

                                {/* Tipe Kamar */}
                                <div className="space-y-2">
                                    <label htmlFor="tipe" className="block text-sm font-semibold text-gray-700">
                                        Tipe Kamar <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="tipe"
                                        name="tipe"
                                        required
                                        defaultValue=""
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm bg-white"
                                    >
                                        <option value="" disabled>Pilih Tipe Kamar</option>
                                        <option value="Standard Single">Standard Single</option>
                                        <option value="Deluxe Queen">Deluxe Queen</option>
                                        <option value="Executive Suite">Executive Suite</option>
                                    </select>
                                </div>
                            </div>

                            {/* Harga per Bulan & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Harga */}
                                <div className="space-y-2">
                                    <label htmlFor="harga_per_bulan" className="block text-sm font-semibold text-gray-700">
                                        Harga per Bulan (Rp) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="harga_per_bulan"
                                        name="harga_per_bulan"
                                        required
                                        min="100000"
                                        step="50000"
                                        placeholder="Contoh: 1500000"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                                        Status Awal <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        required
                                        defaultValue="KOSONG"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm bg-white"
                                    >
                                        <option value="KOSONG">Kosong</option>
                                        <option value="TERISI">Terisi</option>
                                        <option value="PERBAIKAN">Dalam Perbaikan</option>
                                    </select>
                                </div>
                            </div>

                            {/* Fasilitas */}
                            <div className="space-y-2">
                                <label htmlFor="fasilitas" className="block text-sm font-semibold text-gray-700">
                                    Fasilitas Kamar <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fasilitas"
                                    name="fasilitas"
                                    required
                                    placeholder="Contoh: AC, Kasur, Lemari, Meja Belajar, WiFi"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                                />
                                <p className="text-xs text-gray-500">Pisahkan dengan koma.</p>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3 mt-8">
                                <Link href="/admin/kamar">
                                    <span className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-block cursor-pointer">
                                        Batal
                                    </span>
                                </Link>
                                <Button type="submit" variant="primary" size="md" className="px-8 shadow-md shadow-primary/20">
                                    Simpan Kamar Baru
                                </Button>
                            </div>

                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
