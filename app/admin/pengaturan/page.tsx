import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateKostProfile } from "./actions";

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

            <Card className="border-none shadow-sm max-w-3xl">
                <CardBody className="p-8">
                    <form action={updateKostProfile} className="space-y-6">
                        <input type="hidden" name="id" value={profile.id} />

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Nama Kos <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nama_kost"
                                required
                                defaultValue={profile.nama_kost}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Nomor WhatsApp / Kontak <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nomor_kontak"
                                required
                                defaultValue={profile.nomor_kontak}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Gunakan format angka tanpa spasi. Berlaku untuk tombol CTA.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Alamat Lengkap <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="alamat"
                                required
                                rows={3}
                                defaultValue={profile.alamat}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Slogan / Deskripsi Singkat <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="deskripsi"
                                required
                                rows={3}
                                defaultValue={profile.deskripsi}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Teks Hero Section (Halaman Utama) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="hero_title"
                                required
                                defaultValue={profile.hero_title}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Teks besar yang pertama kali dilihat oleh pengunjung.</p>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <Button type="submit" variant="primary" size="md" className="px-8 shadow-md shadow-primary/20 bg-primary hover:bg-primary/90">
                                Simpan Profil Kost
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
