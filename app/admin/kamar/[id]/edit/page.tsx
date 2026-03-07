import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import type { StatusKamar } from "@generated/prisma";
import { notFound } from "next/navigation";

export default async function EditKamarPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ from?: string }>
}) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const from = resolvedSearchParams?.from;

    const backUrl = from === 'penghuni' ? '/admin/penghuni' : '/admin/kamar';
    const backLabel = from === 'penghuni' ? '← Kembali ke Data Penghuni' : '← Kembali ke Daftar Kamar';

    const kamar = await prisma.kamar.findUnique({
        where: { id: resolvedParams.id },
    });

    if (!kamar) {
        notFound();
    }

    // Server Action untuk memproses pembaruan
    async function editKamar(formData: FormData) {
        "use server";

        // Ambil data dari form
        const nomor_kamar = formData.get("nomor_kamar") as string;
        const tipe = formData.get("tipe") as string;
        const harga_per_bulan = parseInt(formData.get("harga_per_bulan") as string, 10);
        const status = formData.get("status") as StatusKamar;
        const fasilitas = formData.get("fasilitas") as string;
        const id = formData.get("id") as string;
        const targetUrl = formData.get("backUrl") as string || "/admin/kamar";

        // Validasi dasar
        if (!nomor_kamar || !tipe || !harga_per_bulan || !status || !fasilitas || !id) {
            throw new Error("Semua kolom harus diisi!");
        }

        // Update PostgreSQL via Prisma
        await prisma.kamar.update({
            where: { id },
            data: {
                nomor_kamar,
                tipe,
                harga_per_bulan,
                status,
                fasilitas,
            },
        });

        // Hapus cache halaman asal dan kembali ke sana
        revalidatePath(targetUrl);
        redirect(targetUrl);
    }

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            {/* Header */}
            <div className="mb-8">
                <Link href={backUrl} className="text-sm text-gray-500 hover:text-primary mb-2 inline-flex items-center gap-1 font-medium">
                    {backLabel}
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Data Kamar</h1>
                <p className="text-gray-500 text-sm mt-0.5">
                    Perbarui informasi untuk Kamar #{kamar.nomor_kamar}.
                </p>
            </div>

            {/* Form Card */}
            <div className="max-w-3xl">
                <Card className="border-none shadow-sm">
                    <CardBody className="p-8">
                        <form action={editKamar} className="space-y-6">

                            <input type="hidden" name="id" value={kamar.id} />
                            <input type="hidden" name="backUrl" value={backUrl} />

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
                                        defaultValue={kamar.nomor_kamar}
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
                                        defaultValue={kamar.tipe}
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
                                        defaultValue={kamar.harga_per_bulan}
                                        placeholder="Contoh: 1500000"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                                        Status Saat Ini <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        required
                                        defaultValue={kamar.status}
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
                                    defaultValue={kamar.fasilitas}
                                    placeholder="Contoh: AC, Kasur, Lemari, Meja Belajar, WiFi"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                                />
                                <p className="text-xs text-gray-500">Pisahkan dengan koma.</p>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3 mt-8">
                                <Link href={backUrl}>
                                    <span className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-block cursor-pointer">
                                        Batal
                                    </span>
                                </Link>
                                <Button type="submit" variant="primary" size="md" className="px-8 shadow-md shadow-primary/20 bg-green-600 hover:bg-green-700 min-w-32">
                                    Simpan Perubahan
                                </Button>
                            </div>

                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
