import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateKostProfile } from "./actions";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
    searchParams
}: {
    searchParams: Promise<{ success?: string }>
}) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    const resolvedParams = await searchParams;
    const isSuccess = resolvedParams?.success === "1";

    // Try finding the first (and only) profile
    let profile = await prisma.kostProfile.findFirst();

    // Setup default dummy if not exist yet
    if (!profile) {
        profile = await prisma.kostProfile.create({
            data: {
                nama_kost: "SmartKos Exclusive",
                alamat: "Jl. Mawar No. 123, SCBD, Jakarta Selatan. 12190",
                nomor_kontak: "081234567890",
                deskripsi: "Kost premium khusus karyawan dan mahasiswa dengan fasilitas bintang 5 dan keamanan 24 jam.",
            }
        });
    }

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Pengaturan Kost</h1>
                <p className="text-gray-500 text-sm mt-0.5">Kelola identitas utama, alamat, dan kontak kost Anda.</p>
            </div>

            {isSuccess && (
                <div className="mb-6 max-w-3xl p-4 bg-green-50/50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
                    <span className="text-xl">✅</span>
                    <p className="font-semibold text-sm">Perubahan pengaturan berhasil disimpan dan sudah rilis ke Halaman Utama!</p>
                </div>
            )}

            <form action={updateKostProfile} className="space-y-8 max-w-4xl pb-12">
                <input type="hidden" name="id" value={profile.id} />

                {/* ================= SECTION 1: PROFIL UTAMA ================= */}
                <Card className="border-none shadow-sm">
                    <CardBody className="p-8 space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">1. Profil Utama Kos</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Nama Kos <span className="text-red-500">*</span></label>
                                <input
                                    type="text" name="nama_kost" required defaultValue={profile.nama_kost}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Nomor WhatsApp <span className="text-red-500">*</span></label>
                                <input
                                    type="text" name="nomor_kontak" required defaultValue={profile.nomor_kontak}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                />
                                <p className="text-xs text-gray-500">Angka berurutan, misal: 081234567890</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <label className="text-sm font-semibold text-gray-700">Logo Kos</label>
                            {profile?.logo_url && (
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                                    <Image src={profile.logo_url} alt="Logo" fill className="object-contain p-2" />
                                </div>
                            )}
                            <input
                                type="file" name="logo_url" accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                            />
                            <p className="text-xs text-gray-500">Logo idealnya berformat transparan (PNG). Jika kosong, inisial huruf yang digunakan.</p>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-semibold text-gray-700">Slogan / Deskripsi Singkat <span className="text-red-500">*</span></label>
                            <textarea
                                name="deskripsi" required rows={3} defaultValue={profile.deskripsi}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* ================= SECTION 2: TAMPILAN BANNER ================= */}
                <Card className="border-none shadow-sm">
                    <CardBody className="p-8 space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">2. Tampilan Halaman Utama (Banner)</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Teks Utama Banner (Visual Hero) <span className="text-red-500">*</span></label>
                            <input
                                type="text" name="hero_title" required defaultValue={profile.hero_title}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            />
                        </div>

                        <div className="space-y-4 pt-2">
                            <label className="text-sm font-semibold text-gray-700">Slider Foto (Pilih Banyak Sekaligus)</label>
                            {profile?.hero_images && profile.hero_images.length > 0 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {profile.hero_images.map((src, idx) => (
                                        <div key={idx} className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                                            <Image src={src} alt={`Slider ${idx}`} fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <input
                                type="file" name="hero_images" accept="image/*" multiple
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-colors"
                            />
                            <p className="text-xs text-gray-500">Akan membuat efek animasi gonta-ganti *(slideshow)* otomatis di beranda (Tekan Shift/Ctrl untuk multi-select).</p>
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <label className="text-sm font-semibold text-gray-700 block mb-2 cursor-pointer opacity-70">Opsi Alternatif: Banner Tunggal Saja</label>
                            {profile?.foto_hero && (
                                <div className="relative w-full max-w-sm h-32 rounded-lg overflow-hidden border border-gray-200 opacity-80">
                                    <Image src={profile.foto_hero} alt="Banner Saat Ini" fill className="object-cover" />
                                </div>
                            )}
                            <input
                                type="file" name="foto_hero" accept="image/*"
                                className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-100 file:text-gray-500 opacity-70 transition-colors"
                            />
                            <p className="text-xs text-gray-400">Jika Anda tidak ingin slider, isi kolom ini saja.</p>
                        </div>
                    </CardBody>
                </Card>

                {/* ================= SECTION 3: LOKASI & PEMBAYARAN ================= */}
                <Card className="border-none shadow-sm">
                    <CardBody className="p-8 space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">3. Lokasi & Pembayaran</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Alamat Lengkap <span className="text-red-500">*</span></label>
                            <textarea
                                name="alamat" required rows={2} defaultValue={profile.alamat}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                            />
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-semibold text-gray-700">Tautan Peta (Google Maps Embed SRC)</label>
                            <input
                                type="text" name="link_gmaps" defaultValue={profile?.link_gmaps || ""} placeholder="https://www.google.com/maps/embed?pb=..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            />
                            <p className="text-xs text-gray-500">Ambil URL dari tag `src="..."` di Embed Map Google Maps.</p>
                        </div>

                        <div className="pt-4 border-t border-gray-100 mt-6 pt-6">
                            <h3 className="font-bold text-gray-800 mb-4">Pengaturan Transfer Pembayaran</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Nama Bank <span className="text-red-500">*</span></label>
                                    <input
                                        type="text" name="nama_bank" required defaultValue={profile?.nama_bank || "BCA"} placeholder="Cth: BCA"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Nomor Rekening <span className="text-red-500">*</span></label>
                                    <input
                                        type="text" name="nomor_rekening" required defaultValue={profile?.nomor_rekening || ""} placeholder="Tanpa spasi"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Atas Nama Rekening <span className="text-red-500">*</span></label>
                                    <input
                                        type="text" name="nama_pemilik_rekening" required defaultValue={profile?.nama_pemilik_rekening || ""} placeholder="Nama pemilik sah"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-4 pt-6">
                                <label className="text-sm font-medium text-gray-700">Foto Barcode QRIS Alternatif</label>
                                {profile?.foto_qris && (
                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                        <Image src={profile.foto_qris} alt="QRIS" fill className="object-cover" />
                                    </div>
                                )}
                                <input
                                    type="file" name="foto_qris" accept="image/*"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <div className="flex justify-end pt-4 sticky bottom-6 z-10 transition-transform">
                    <Button type="submit" variant="primary" className="px-6 py-2.5 shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 text-sm font-bold rounded-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        Simpan Semua Pengaturan
                    </Button>
                </div>
            </form>
        </div>
    );
}
