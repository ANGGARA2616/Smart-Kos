"use client";

import { useState, useTransition } from "react";
import { updateTiketStatus } from "@/app/admin/keluhan/actions";
import type { StatusTiket } from "@generated/prisma";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function StatusKeluhanButton({ id, currentStatus }: { id: string; currentStatus: StatusTiket }) {
    const [isPending, startTransition] = useTransition();
    const [modal, setModal] = useState<"proses" | "selesai" | null>(null);

    const handleConfirm = () => {
        if (modal === "proses") {
            startTransition(async () => {
                await updateTiketStatus(id, "PROSES");
            });
        } else if (modal === "selesai") {
            startTransition(async () => {
                await updateTiketStatus(id, "SELESAI");
            });
        }
        setModal(null);
    };

    return (
        <>
            <div className="flex items-center gap-2">
                {currentStatus === "OPEN" && (
                    <button
                        onClick={() => setModal("proses")}
                        disabled={isPending}
                        className="px-3 py-1.5 bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-500 hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                    >
                        Proses
                    </button>
                )}
                {currentStatus === "PROSES" && (
                    <button
                        onClick={() => setModal("selesai")}
                        disabled={isPending}
                        className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 hover:bg-green-600 hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                    >
                        Selesai
                    </button>
                )}
                {currentStatus === "SELESAI" && (
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 uppercase">
                        Tuntas
                    </span>
                )}
            </div>

            <ConfirmModal
                open={modal === "proses"}
                title="Proses Keluhan"
                message="Ubah status keluhan menjadi DIPROSES?"
                confirmLabel="Ya, Proses"
                variant="warning"
                onConfirm={handleConfirm}
                onCancel={() => setModal(null)}
            />

            <ConfirmModal
                open={modal === "selesai"}
                title="Selesaikan Keluhan"
                message="Tandai keluhan ini sebagai SELESAI?"
                confirmLabel="Ya, Selesai"
                variant="success"
                onConfirm={handleConfirm}
                onCancel={() => setModal(null)}
            />
        </>
    );
}
