import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import type { StatusKamar } from "@generated/prisma";
import { uploadFile } from "@/lib/supabase-storage";

export default async function TambahKamarPage({
    searchParams
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const errorMsg = (await searchParams)?.error;

    async function tambahKamar(formData: FormData) {
        "use server";

        const nomor_kamar = formData.get("nomor_kamar") as string;
        const tipe = formData.get("tipe") as string;
        const harga_per_bulan = parseInt(formData.get("harga_per_bulan") as string, 10);
        const status = formData.get("status") as StatusKamar;
        const fasilitas = formData.get("fasilitas") as string;
        const file = formData.get("foto_kamar") as File;

        if (!nomor_kamar || !tipe || !harga_per_bulan || !status || !fasilitas) {
            redirect("/admin/kamar/tambah?error=Semua kolom harus diisi!");
        }

        // --- CEK DUPLIKASI NOMOR KAMAR ---
        const existingKamar = await prisma.kamar.findUnique({
            where: { nomor_kamar }
        });

        if (existingKamar) {
            redirect(`/admin/kamar/tambah?error=Nomor Kamar ${nomor_kamar} sudah terdaftar. Silakan gunakan nomor unik lainnya!`);
        }


        // Upload foto ke Supabase Storage
        let foto_utama: string | null = null;
        if (file && file.size > 0) {
            foto_utama = await uploadFile(file, "kamar");
        }

        await prisma.kamar.create({
            data: {
                nomor_kamar,
                tipe,
                harga_per_bulan,
                status,
                fasilitas,
                foto_utama,
            },
        });

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
                        {errorMsg && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl flex items-center gap-3">
                                <span className="text-xl">⚠️</span>
                                <p>{errorMsg}</p>
                            </div>
                        )}

                        <form action={tambahKamar} className="space-y-6">

                            {/* Foto Kamar */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Foto Kamar
                                </label>
                                <input
                                    type="file"
                                    name="foto_kamar"
                                    accept="image/*"
                                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer border border-gray-200 rounded-lg p-1.5 bg-white outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                />
                                <p className="text-xs text-gray-400">Opsional. Unggah foto kamar untuk ditampilkan (maks 5MB).</p>
                            </div>

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

                                {/* Tipe Kamar — Input Manual */}
                                <div className="space-y-2">
                                    <label htmlFor="tipe" className="block text-sm font-semibold text-gray-700">
                                        Tipe Kamar <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="tipe"
                                        name="tipe"
                                        required
                                        placeholder="Contoh: Standard Single, Deluxe Queen"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                                    />
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
