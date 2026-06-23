"use client";

import { Button } from "@/components/ui/legacy-button";
import { useState, useTransition } from "react";
import { submitPembayaran } from "./actions";

export default function CheckoutForm({ kamarId, hargaPerBulan }: { kamarId: string, hargaPerBulan: number }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [durasiSewa, setDurasiSewa] = useState<number>(1);

    const totalHarga = durasiSewa * hargaPerBulan;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);

        formData.append("durasi_sewa", durasiSewa.toString());
        formData.append("total_harga", totalHarga.toString());

        startTransition(async () => {
            const res = await submitPembayaran(formData);
            if (res?.error) {
                setError(res.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            {error && <div className="p-3 bg-red-50 text-red-600 font-semibold text-sm rounded-lg border border-red-200 text-center">{error}</div>}

            <input type="hidden" name="kamar_id" value={kamarId} />

            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800">1. Pilih Durasi Sewa</label>
                <div className="grid grid-cols-3 gap-3">
                    {[1, 6, 12].map(durasi => (
                        <div
                            key={durasi}
                            onClick={() => setDurasiSewa(durasi)}
                            className={`cursor-pointer border rounded-xl py-3 px-3 text-center transition-all ease-out ${durasiSewa === durasi
                                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary/30 scale-100'
                                    : 'border-[#EAEDF3]/80 bg-white text-gray-500 hover:bg-[#F9FAFC] hover:border-[#C9D0DC] hover:text-gray-900 scale-95'
                                }`}
                        >
                            <span className="block text-lg mb-0.5">{durasi}</span>
                            <span className="text-[10px] uppercase font-semibold tracking-wider opacity-90">Bulan</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border text-primary border-primary/20 p-5 rounded-xl shadow-sm relative overflow-hidden mt-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                <p className="font-bold text-xs uppercase tracking-wider mb-1">2. Tagihan Sewa</p>
                <div className="flex items-end gap-2">
                    <p className="font-black text-3xl text-gray-900 tracking-tight">Rp {totalHarga.toLocaleString('id-ID')}</p>
                </div>
                <p className="text-[11px] text-gray-400 mt-2.5 font-medium leading-relaxed">Penting: Nominal pen-transferan ke PT SmartKos Indonesia wajib persis tanpa pembulatan.</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-dashed border-[#EAEDF3]">
                <label className="block text-sm font-semibold text-gray-800">3. Unggah Bukti (JPG/PNG)</label>
                <input
                    type="file"
                    name="bukti_transfer"
                    accept="image/*"
                    required
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer border border-[#EAEDF3] rounded-lg p-1.5 bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
                <p className="text-[11px] text-gray-400 font-medium pl-1">Ukuran maskimal 5 MB dengan tanggal transfer yang jelas.</p>
            </div>

            <Button type="submit" variant="primary" className="w-full font-bold pt-3 pb-3 mt-6 text-[15px] shadow-lg shadow-primary/25" disabled={isPending}>
                {isPending ? "Memproses Transaksi..." : "Kirim Bukti Pembayaran"}
            </Button>
        </form>
    );
}
