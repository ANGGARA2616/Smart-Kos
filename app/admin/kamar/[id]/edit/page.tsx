import { Card, CardBody } from "@/components/ui/legacy-card";
import { Button } from "@/components/ui/legacy-button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import type { StatusKamar } from "@generated/prisma";
import { notFound } from "next/navigation";
import { uploadFile } from "@/lib/supabase-storage";
import Image from "next/image";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default async function EditKamarPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ from?: string, error?: string }>
}) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const from = resolvedSearchParams?.from;
    const errorMsg = resolvedSearchParams?.error;

    const backUrl = from === 'penghuni' ? '/admin/penghuni' : '/admin/kamar';
    const backLabel = from === 'penghuni' ? 'Kembali ke Data Penghuni' : 'Kembali ke Daftar Kamar';

    const kamar = await prisma.kamar.findUnique({
        where: { id: resolvedParams.id },
    });

    if (!kamar) {
        notFound();
    }

    // Cek apakah kamar saat ini memiliki penghuni aktif
    const penghuniAktif = await prisma.user.findFirst({
        where: { kamar_id: kamar.id, status: "PENGHUNI" }
    });

    // Server Action untuk memproses pembaruan
    async function editKamar(formData: FormData) {
        "use server";

        const nomor_kamar = formData.get("nomor_kamar") as string;
        const tipe = formData.get("tipe") as string;
        const harga_per_bulan = parseInt(formData.get("harga_per_bulan") as string, 10);
        const status = formData.get("status") as StatusKamar;
        const fasilitas = formData.get("fasilitas") as string;
        const id = formData.get("id") as string;
        const targetUrl = formData.get("backUrl") as string || "/admin/kamar";
        const file = formData.get("foto_kamar") as File;

        if (!nomor_kamar || !tipe || !harga_per_bulan || !status || !fasilitas || !id) {
             redirect(`/admin/kamar/${id}/edit?error=Semua kolom wajib diisi`);
        }

        // --- CEK DUPLIKASI NOMOR KAMAR (Namun kecualikan ID kamar yang sedang di-edit ini) ---
        const existingKamar = await prisma.kamar.findUnique({
             where: { nomor_kamar }
        });

        if (existingKamar && existingKamar.id !== id) {
             redirect(`/admin/kamar/${id}/edit?error=Nomor Kamar ${nomor_kamar} sudah digunakan oleh kamar lain. Silakan gunakan nomor yang berbeda.`);
        }

        // === LOGIKA PROTEKSI: Cegah ubah TERISI→KOSONG jika masih ada penghuni ===
        const currentKamar = await prisma.kamar.findUnique({ where: { id } });
        if (currentKamar && currentKamar.status === "TERISI" && status === "KOSONG") {
            const adaPenghuni = await prisma.user.findFirst({
                where: { kamar_id: id, status: "PENGHUNI" }
            });
            if (adaPenghuni) {
                // Keluarkan penghuni dari kamar: ubah status user kembali ke CALON_PENGHUNI dan lepas kamar_id
                await prisma.user.update({
                    where: { id: adaPenghuni.id },
                    data: { status: "CALON_PENGHUNI", kamar_id: null }
                });
            }
        }

        // === UPLOAD FOTO ke Supabase Storage (opsional) ===
        let foto_utama = currentKamar?.foto_utama ?? null;
        if (file && file.size > 0) {
            const uploadedUrl = await uploadFile(file, "kamar");
            if (uploadedUrl) foto_utama = uploadedUrl;
        }

        await prisma.kamar.update({
            where: { id },
            data: {
                nomor_kamar,
                tipe,
                harga_per_bulan,
                status,
                fasilitas,
                foto_utama,
            },
        });

        revalidatePath(targetUrl);
        revalidatePath("/admin/kamar");
        redirect(targetUrl);
    }

    const inputClass = "w-full border border-[#EAEDF3] rounded-lg px-4 py-2.5 text-[#0E1424] bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/25 focus:border-[#C9D6FF] transition-colors text-sm";
    const labelClass = "block text-sm font-semibold text-[#384151]";

    return (
        <div className="p-6 lg:p-8 min-h-full">
            {/* Back link */}
            <div className="mb-6">
                <Link href={backUrl} className="text-sm text-[#7B8597] hover:text-[#2F6BFF] inline-flex items-center gap-1 font-medium">
                    <ArrowLeft className="h-4 w-4" strokeWidth={2} /> {backLabel}
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

                        <form action={editKamar} className="space-y-6">

                            <input type="hidden" name="id" value={kamar.id} />
                            <input type="hidden" name="backUrl" value={backUrl} />

                            {/* Foto Kamar */}
                            <div className="space-y-3">
                                <label className={labelClass}>
                                    Foto Kamar
                                </label>
                                {kamar.foto_utama && (
                                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[#EAEDF3] bg-[#F4F6FA]">
                                        <Image src={kamar.foto_utama} alt={kamar.tipe} fill className="object-cover" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                                            <p className="text-white text-xs font-semibold">Foto saat ini</p>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="foto_kamar"
                                    accept="image/*"
                                    className="w-full text-sm text-[#7B8597] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#EAF0FF] file:text-[#2F6BFF] hover:file:bg-[#DCE6FF] cursor-pointer border border-[#EAEDF3] rounded-lg p-1.5 bg-white outline-none focus:ring-2 focus:ring-[#2F6BFF]/25 transition-all"
                                />
                                <p className="text-xs text-[#9AA3B4]">Kosongkan jika tidak ingin mengubah foto. Maks 5MB.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nomor Kamar */}
                                <div className="space-y-2">
                                    <label htmlFor="nomor_kamar" className={labelClass}>
                                        Nomor Kamar <span className="text-[#E5484D]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="nomor_kamar"
                                        name="nomor_kamar"
                                        required
                                        defaultValue={kamar.nomor_kamar}
                                        placeholder="Contoh: 105"
                                        className={inputClass}
                                    />
                                </div>

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
                                        defaultValue={kamar.tipe}
                                        placeholder="Contoh: Standard Single, Deluxe Queen"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Harga per Bulan & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        defaultValue={kamar.harga_per_bulan}
                                        placeholder="Contoh: 1500000"
                                        className={inputClass}
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label htmlFor="status" className={labelClass}>
                                        Status Saat Ini <span className="text-[#E5484D]">*</span>
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        required
                                        defaultValue={kamar.status}
                                        className={inputClass}
                                    >
                                        <option value="KOSONG">Kosong</option>
                                        <option value="TERISI">Terisi</option>
                                        <option value="PERBAIKAN">Dalam Perbaikan</option>
                                    </select>
                                    {penghuniAktif && (
                                        <div className="flex items-start gap-2 p-3 bg-[#FFF4E0] border border-[#F5E2BD] rounded-lg mt-1">
                                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-[#B7791F]" strokeWidth={2} />
                                            <p className="text-xs text-[#B7791F] font-semibold leading-relaxed">
                                                Kamar ini sedang ditempati <strong>{penghuniAktif.nama}</strong>.
                                                Jika Anda mengubah status ke &quot;Kosong&quot;, penghuni akan otomatis dikeluarkan dari kamar ini.
                                            </p>
                                        </div>
                                    )}
                                </div>
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
                                    defaultValue={kamar.fasilitas}
                                    placeholder="Contoh: AC, Kasur, Lemari, Meja Belajar, WiFi"
                                    className={inputClass}
                                />
                                <p className="text-xs text-[#7B8597]">Pisahkan dengan koma.</p>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 border-t border-[#EAEDF3] flex items-center justify-end gap-3 mt-8">
                                <Link href={backUrl}>
                                    <span className="px-5 py-2.5 text-sm font-semibold text-[#384151] bg-white border border-[#EAEDF3] rounded-lg hover:bg-[#F4F6FA] transition-colors inline-block cursor-pointer">
                                        Batal
                                    </span>
                                </Link>
                                <Button type="submit" variant="primary" size="md" className="px-8 shadow-md shadow-[#16A572]/20 bg-[#16A572] hover:bg-[#138a60] min-w-32">
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
