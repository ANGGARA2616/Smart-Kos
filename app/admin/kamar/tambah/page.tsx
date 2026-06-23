import { Card, CardBody } from "@/components/ui/legacy-card";
import { Button } from "@/components/ui/legacy-button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import type { StatusKamar } from "@generated/prisma";
import { uploadFile } from "@/lib/supabase-storage";
import { ArrowLeft, AlertTriangle, ChevronDown } from "lucide-react";

// Batas jumlah kamar yang boleh dibuat dalam satu kali submit (cegah salah ketik rentang)
const MAX_BATCH = 100;

export default async function TambahKamarPage({
    searchParams
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const errorMsg = (await searchParams)?.error;

    async function tambahKamar(formData: FormData) {
        "use server";

        const tipe = ((formData.get("tipe") as string) || "").trim();
        const harga_per_bulan = parseInt(formData.get("harga_per_bulan") as string, 10);
        const status = formData.get("status") as StatusKamar;
        const fasilitas = ((formData.get("fasilitas") as string) || "").trim();
        const file = formData.get("foto_kamar") as File;

        const nomorListRaw = (formData.get("nomor_kamar_list") as string) || "";
        const rangeStartRaw = ((formData.get("range_start") as string) || "").trim();
        const rangeEndRaw = ((formData.get("range_end") as string) || "").trim();

        // Helper redirect error (mengembalikan never → menghentikan eksekusi)
        const fail = (msg: string): never =>
            redirect(`/admin/kamar/tambah?error=${encodeURIComponent(msg)}`);

        // Field kategori wajib (berlaku untuk semua kamar)
        if (!tipe || !harga_per_bulan || !status || !fasilitas) {
            fail("Lengkapi tipe, harga, status, dan fasilitas kamar!");
        }

        // 1. Nomor dari kolom utama (pisah koma / baris baru / titik koma)
        const fromList = nomorListRaw
            .split(/[\n,;]+/)
            .map((s) => s.trim())
            .filter(Boolean);

        // 2. Nomor dari opsi "buat berurutan" (dari–sampai, hanya angka)
        const fromRange: string[] = [];
        if (rangeStartRaw || rangeEndRaw) {
            if (!rangeStartRaw || !rangeEndRaw) {
                fail("Isi kolom 'Dari nomor' dan 'Sampai nomor', atau kosongkan keduanya.");
            }
            const start = parseInt(rangeStartRaw, 10);
            const end = parseInt(rangeEndRaw, 10);
            if (Number.isNaN(start) || Number.isNaN(end)) {
                fail("'Dari nomor' dan 'Sampai nomor' harus berupa angka.");
            }
            if (start > end) {
                fail("'Dari nomor' tidak boleh lebih besar dari 'Sampai nomor'.");
            }
            if (end - start + 1 > MAX_BATCH) {
                fail(`Rentang terlalu besar. Maksimal ${MAX_BATCH} kamar sekali tambah.`);
            }
            for (let i = start; i <= end; i++) {
                fromRange.push(String(i));
            }
        }

        // Gabung + buang duplikat (urutan dipertahankan)
        const numbers = Array.from(new Set([...fromList, ...fromRange]));

        if (numbers.length === 0) {
            fail("Isi nomor kamar terlebih dahulu.");
        }
        if (numbers.length > MAX_BATCH) {
            fail(`Terlalu banyak kamar (${numbers.length}). Maksimal ${MAX_BATCH} kamar sekali tambah.`);
        }

        // Cek duplikat di database
        const existing = await prisma.kamar.findMany({
            where: { nomor_kamar: { in: numbers } },
            select: { nomor_kamar: true },
        });
        if (existing.length > 0) {
            const list = existing.map((k) => k.nomor_kamar).join(", ");
            fail(`Nomor kamar ini sudah ada: ${list}. Gunakan nomor lain.`);
        }

        // Upload foto sekali, lalu dipakai untuk semua kamar
        let foto_utama: string | null = null;
        if (file && file.size > 0) {
            foto_utama = await uploadFile(file, "kamar");
        }

        try {
            await prisma.kamar.createMany({
                data: numbers.map((nomor_kamar) => ({
                    nomor_kamar,
                    tipe,
                    harga_per_bulan,
                    status,
                    fasilitas,
                    foto_utama,
                })),
            });
        } catch (err) {
            // Tangani race unique violation (Prisma P2002)
            if (err && typeof err === "object" && "code" in err && (err as { code?: string }).code === "P2002") {
                fail("Sebagian nomor kamar baru saja terpakai. Silakan coba lagi dengan nomor lain.");
            }
            throw err;
        }

        revalidatePath("/admin/kamar");
        redirect("/admin/kamar");
    }

    const inputClass = "w-full border border-[#EAEDF3] rounded-lg px-4 py-2.5 text-[#0E1424] bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/25 focus:border-[#C9D6FF] transition-colors text-sm";
    const labelClass = "block text-sm font-semibold text-[#384151]";

    return (
        <div className="p-6 lg:p-8 min-h-full">
            {/* Back link */}
            <div className="mb-6">
                <Link href="/admin/kamar" className="text-sm text-[#7B8597] hover:text-[#2F6BFF] inline-flex items-center gap-1 font-medium">
                    <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Kembali ke Daftar Kamar
                </Link>
            </div>

            {/* Form Card */}
            <div className="max-w-3xl">
                <Card>
                    <CardBody className="p-8">
                        {errorMsg && (
                            <div className="mb-6 p-4 bg-[#FDECEC] border border-[#F7CFD0] text-[#E5484D] text-sm font-semibold rounded-xl flex items-center gap-3">
                                <AlertTriangle className="h-5 w-5 shrink-0" strokeWidth={2} />
                                <p>{errorMsg}</p>
                            </div>
                        )}

                        <form action={tambahKamar} className="space-y-6">

                            {/* Nomor Kamar */}
                            <div className="space-y-2">
                                <label htmlFor="nomor_kamar_list" className={labelClass}>
                                    Nomor Kamar <span className="text-[#E5484D]">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="nomor_kamar_list"
                                    name="nomor_kamar_list"
                                    placeholder="Contoh: 101"
                                    className={inputClass}
                                />
                                <p className="text-xs text-[#7B8597]">
                                    Mau tambah beberapa kamar sekaligus? Tulis nomornya dipisah koma. Contoh: <span className="font-semibold text-[#384151]">101, 102, 103</span>
                                </p>

                                {/* Opsi lanjutan: buat nomor berurutan */}
                                <details className="group mt-2 rounded-lg border border-[#EAEDF3] bg-[#F9FAFC]">
                                    <summary className="flex items-center gap-2 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden px-4 py-3 text-sm font-semibold text-[#2F6BFF]">
                                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" strokeWidth={2.5} />
                                        Atau buat nomor berurutan otomatis
                                    </summary>
                                    <div className="px-4 pb-4 pt-1 space-y-3">
                                        <p className="text-xs text-[#7B8597]">
                                            Cocok untuk kamar berurutan. Misalnya <span className="font-semibold text-[#384151]">dari 101 sampai 110</span> akan membuat 10 kamar: 101, 102, &hellip; 110.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label htmlFor="range_start" className="block text-xs font-semibold text-[#384151]">Dari nomor</label>
                                                <input
                                                    type="number"
                                                    id="range_start"
                                                    name="range_start"
                                                    placeholder="Contoh: 101"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label htmlFor="range_end" className="block text-xs font-semibold text-[#384151]">Sampai nomor</label>
                                                <input
                                                    type="number"
                                                    id="range_end"
                                                    name="range_end"
                                                    placeholder="Contoh: 110"
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </details>
                            </div>

                            {/* Tipe & Harga */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tipe Kamar — Input Manual */}
                                <div className="space-y-2">
                                    <label htmlFor="tipe" className={labelClass}>
                                        Tipe Kamar <span className="text-[#E5484D]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="tipe"
                                        name="tipe"
                                        required
                                        placeholder="Contoh: Standar, VIP"
                                        className={inputClass}
                                    />
                                </div>

                                {/* Harga */}
                                <div className="space-y-2">
                                    <label htmlFor="harga_per_bulan" className={labelClass}>
                                        Harga per Bulan (Rp) <span className="text-[#E5484D]">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="harga_per_bulan"
                                        name="harga_per_bulan"
                                        required
                                        min="100000"
                                        step="50000"
                                        placeholder="Contoh: 1500000"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Status & Fasilitas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Status */}
                                <div className="space-y-2">
                                    <label htmlFor="status" className={labelClass}>
                                        Status Awal <span className="text-[#E5484D]">*</span>
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        required
                                        defaultValue="KOSONG"
                                        className={inputClass}
                                    >
                                        <option value="KOSONG">Kosong</option>
                                        <option value="TERISI">Terisi</option>
                                        <option value="PERBAIKAN">Dalam Perbaikan</option>
                                    </select>
                                </div>

                                {/* Fasilitas */}
                                <div className="space-y-2">
                                    <label htmlFor="fasilitas" className={labelClass}>
                                        Fasilitas Kamar <span className="text-[#E5484D]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="fasilitas"
                                        name="fasilitas"
                                        required
                                        placeholder="Contoh: AC, Kasur, Lemari, Meja"
                                        className={inputClass}
                                    />
                                    <p className="text-xs text-[#7B8597]">Pisahkan dengan koma.</p>
                                </div>
                            </div>

                            {/* Foto Kamar */}
                            <div className="space-y-3">
                                <label className={labelClass}>
                                    Foto Kamar
                                </label>
                                <input
                                    type="file"
                                    name="foto_kamar"
                                    accept="image/*"
                                    className="w-full text-sm text-[#7B8597] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#EAF0FF] file:text-[#2F6BFF] hover:file:bg-[#DCE6FF] cursor-pointer border border-[#EAEDF3] rounded-lg p-1.5 bg-white outline-none focus:ring-2 focus:ring-[#2F6BFF]/25 transition-all"
                                />
                                <p className="text-xs text-[#9AA3B4]">Opsional. Kalau menambah beberapa kamar, foto ini dipakai untuk semuanya (maks 5MB).</p>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 border-t border-[#EAEDF3] flex items-center justify-end gap-3 mt-8">
                                <Link href="/admin/kamar">
                                    <span className="px-5 py-2.5 text-sm font-semibold text-[#384151] bg-white border border-[#EAEDF3] rounded-lg hover:bg-[#F4F6FA] transition-colors inline-block cursor-pointer">
                                        Batal
                                    </span>
                                </Link>
                                <Button type="submit" variant="primary" size="md" className="px-8 shadow-md shadow-[#2F6BFF]/20">
                                    Simpan Kamar
                                </Button>
                            </div>

                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
