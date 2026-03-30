"use client";

import { useState, useTransition } from "react";
import { approveBooking, rejectBooking } from "@/app/admin/verifikasi/actions";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function VerifikasiActions({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();
    const [modal, setModal] = useState<{ type: "approve" | "reject" } | null>(null);

    const handleConfirm = () => {
        if (modal?.type === "approve") {
            startTransition(async () => {
                await approveBooking(id);
            });
        } else if (modal?.type === "reject") {
            startTransition(async () => {
                await rejectBooking(id);
            });
        }
        setModal(null);
    };

    return (
        <>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setModal({ type: "approve" })}
                    disabled={isPending}
                    className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 hover:bg-green-600 hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                >
                    Terima
                </button>
                <button
                    onClick={() => setModal({ type: "reject" })}
                    disabled={isPending}
                    className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                >
                    Tolak
                </button>
            </div>

            <ConfirmModal
                open={modal?.type === "approve"}
                title="Setujui Pembayaran"
                message="Yakin ingin MENYETUJUI bukti transfer ini? User akan otomatis menjadi PENGHUNI."
                confirmLabel="Ya, Setujui"
                variant="success"
                onConfirm={handleConfirm}
                onCancel={() => setModal(null)}
            />

            <ConfirmModal
                open={modal?.type === "reject"}
                title="Tolak Pembayaran"
                message="Yakin ingin MENOLAK bukti transfer ini?"
                confirmLabel="Ya, Tolak"
                variant="danger"
                onConfirm={handleConfirm}
                onCancel={() => setModal(null)}
            />
        </>
    );
}
