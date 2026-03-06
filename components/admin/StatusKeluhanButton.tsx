"use client";

import { useTransition } from "react";
import { updateTiketStatus } from "@/app/admin/keluhan/actions";
import type { StatusTiket } from "@generated/prisma";

export default function StatusKeluhanButton({ id, currentStatus }: { id: string; currentStatus: StatusTiket }) {
    const [isPending, startTransition] = useTransition();

    const handleProses = () => {
        if (window.confirm("Ubah status keluhan menjadi DIPROSES?")) {
            startTransition(async () => {
                await updateTiketStatus(id, "PROSES");
            });
        }
    };

    const handleSelesai = () => {
        if (window.confirm("Tandai keluhan ini sebagai SELESAI?")) {
            startTransition(async () => {
                await updateTiketStatus(id, "SELESAI");
            });
        }
    };

    return (
        <div className="flex items-center gap-2">
            {currentStatus === "OPEN" && (
                <button
                    onClick={handleProses}
                    disabled={isPending}
                    className="px-3 py-1.5 bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-500 hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                >
                    Proses
                </button>
            )}
            {currentStatus === "PROSES" && (
                <button
                    onClick={handleSelesai}
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
    );
}
