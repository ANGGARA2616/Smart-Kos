"use client";

import { Button } from "@/components/ui/Button";
import { useState, useTransition } from "react";
import { tambahPenghuniManual } from "@/app/admin/penghuni/actions";

interface KamarOption {
    id: string;
    nomor_kamar: string;
    tipe: string;
    harga_per_bulan: number;
}

export default function TambahPenghuniForm({ kamarKosong }: { kamarKosong: KamarOption[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [selectedKamar, setSelectedKamar] = useState<KamarOption | null>(null);
    const [durasi, setDurasi] = useState(1);

    const totalHarga = selectedKamar ? selectedKamar.harga_per_bulan * durasi : 0;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        formData.append("durasi_sewa", durasi.toString());

        startTransition(async () => {
            const res = await tambahPenghuniManual(formData);
            if (res?.error) {
                setError(res.error);
            } else {
                setIsOpen(false);
            }
        });
    };

    if (!isOpen) {
        return (
            <Button
                variant="primary"
                className="text-sm font-bold shadow-md shadow-primary/20"
                onClick={() => setIsOpen(true)}
            >
                + Tambah Penghuni Manual
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Tambah Penghuni Manual</h2>
                        <p className="text-xs text-gray-500 mt-0.5 leading-normal">Untuk penghuni yang mendaftar secara langsung/offline.</p>
                    </div>
                    <button onClick={() => { setIsOpen(false); setError(null); }} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-lg transition-colors">
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 font-semibold text-sm rounded-lg border border-red-200 text-center">{error}</div>
                    )}

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Nama Lengkap <span className="text-red-500">*</span></label>
                        <input type="text" name="nama" required placeholder="Masukkan nama lengkap"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Email <span className="text-red-500">*</span></label>
                            <input type="email" name="email" required placeholder="email@contoh.com"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">No. HP <span className="text-red-500">*</span></label>
                            <input type="text" name="no_hp" required placeholder="08xxxxxxxxxx"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Pilih Kamar <span className="text-red-500">*</span></label>
                        {kamarKosong.length === 0 ? (
                            <div className="p-3 bg-amber-50 text-amber-700 text-sm font-semibold rounded-lg border border-amber-200">
                                Tidak ada kamar kosong yang tersedia saat ini.
                            </div>
                        ) : (
                            <select
                                name="kamar_id"
                                required
                                defaultValue=""
                                onChange={(e) => {
                                    const k = kamarKosong.find(k => k.id === e.target.value);
                                    setSelectedKamar(k || null);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-white"
                            >
                                <option value="" disabled>-- Pilih Kamar --</option>
                                {kamarKosong.map(k => (
                                    <option key={k.id} value={k.id}>
                                        #{k.nomor_kamar} — {k.tipe} (Rp {k.harga_per_bulan.toLocaleString('id-ID')}/bln)
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Durasi Sewa</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[1, 6, 12].map(d => (
                                <div
                                    key={d}
                                    onClick={() => setDurasi(d)}
                                    className={`cursor-pointer border rounded-xl py-2.5 px-3 text-center transition-all ${
                                        durasi === d 
                                        ? 'border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary/30' 
                                        : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                                >
                                    <span className="block text-base font-bold">{d}</span>
                                    <span className="text-[10px] uppercase font-semibold tracking-wider opacity-80">Bulan</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedKamar && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                            <p className="text-xs font-bold text-primary uppercase mb-1">Total Tagihan</p>
                            <p className="text-2xl font-black text-gray-900">Rp {totalHarga.toLocaleString('id-ID')}</p>
                            <p className="text-[11px] text-gray-500 mt-1">Kamar #{selectedKamar.nomor_kamar} × {durasi} bulan</p>
                        </div>
                    )}

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs text-amber-700 font-medium leading-relaxed flex items-start gap-2">
                            <span className="text-base">ℹ️</span>
                            <span>Password default penghuni: <strong>penghuni123</strong>. Penghuni bisa menggantinya setelah login ke sistem.</span>
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => { setIsOpen(false); setError(null); }}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Batal
                        </button>
                        <Button type="submit" variant="primary" className="flex-1 font-bold shadow-md shadow-primary/20" disabled={isPending || kamarKosong.length === 0}>
                            {isPending ? "Menyimpan..." : "Simpan Penghuni"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
