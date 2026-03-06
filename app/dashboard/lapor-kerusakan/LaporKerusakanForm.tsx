"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createLaporan } from "./actions";

export default function LaporKerusakanForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const res = await createLaporan(formData);
            if (res?.error) {
                setError(res.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 font-semibold text-sm rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Kategori Kendala</label>
                <select name="kategori" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm bg-white text-gray-900">
                    <option value="">Pilih Kategori...</option>
                    <option value="AC / Pendingin">AC / Pendingin</option>
                    <option value="Kelistrikan & Lampu">Kelistrikan & Lampu</option>
                    <option value="Air & Pipa">Air & Pipa</option>
                    <option value="Perabotan Kamar">Perabotan Kamar</option>
                    <option value="Lainnya">Lainnya...</option>
                </select>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Deskripsi Kendala</label>
                <textarea
                    name="deskripsi"
                    required
                    rows={4}
                    placeholder="Ceritakan sedetail mungkin apa masalahnya..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm text-gray-900 resize-none"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Lampirkan Foto (Opsional)</label>
                <input
                    type="file"
                    name="foto_kendala"
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border border-gray-200 rounded-lg p-1.5 bg-gray-50 outline-none transition-all"
                />
            </div>

            <Button type="submit" variant="primary" className="w-full pt-3 pb-3 font-bold mt-2 shadow-md shadow-primary/20" disabled={isPending}>
                {isPending ? "Mengirim Laporan..." : "Kirim Laporan"}
            </Button>
        </form>
    );
}
