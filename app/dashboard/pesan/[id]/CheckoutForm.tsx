"use client";

import { Button } from "@/components/ui/Button";
import { useState, useTransition } from "react";
import { submitPembayaran } from "./actions";

export default function CheckoutForm({ kamarId }: { kamarId: string }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const res = await submitPembayaran(formData);
            if (res?.error) {
                setError(res.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {error && <div className="p-3 bg-red-50 text-red-600 font-semibold text-sm rounded-lg border border-red-200 text-center">{error}</div>}

            <input type="hidden" name="kamar_id" value={kamarId} />

            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Pilih File Foto (JPG/PNG)</label>
                <input
                    type="file"
                    name="bukti_transfer"
                    accept="image/*"
                    required
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer border border-gray-200 rounded-lg p-1.5 bg-gray-50 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
                <p className="text-xs text-gray-400 mt-1 pl-1">Maksimal ukuran: 5MB.</p>
            </div>

            <Button type="submit" variant="primary" className="w-full font-bold pt-3 pb-3 mt-4 text-[15px] shadow-lg shadow-primary/20" disabled={isPending}>
                {isPending ? "Mengunggah..." : "✓ Konfirmasi & Kirim Bukti Pembayaran"}
            </Button>
        </form>
    );
}
