"use client";

import { useTransition } from "react";
import { approveBooking, rejectBooking } from "@/app/admin/verifikasi/actions";

export default function VerifikasiActions({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleApprove = () => {
        if (window.confirm("Yakin ingin MENYETUJUI bukti transfer ini? User akan otomatis menjadi PENGHUNI.")) {
            startTransition(async () => {
                await approveBooking(id);
            });
        }
    };

    const handleReject = () => {
        if (window.confirm("Yakin ingin MENOLAK bukti transfer ini?")) {
            startTransition(async () => {
                await rejectBooking(id);
            });
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleApprove}
                disabled={isPending}
                className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 hover:bg-green-600 hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
                Terima
            </button>
            <button
                onClick={handleReject}
                disabled={isPending}
                className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
                Tolak
            </button>
        </div>
    );
}
