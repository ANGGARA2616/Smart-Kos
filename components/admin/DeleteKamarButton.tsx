"use client";

import { useTransition } from "react";
import { hapusKamar } from "@/app/admin/kamar/actions";

export default function DeleteKamarButton({ id, nomor_kamar }: { id: string, nomor_kamar: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (window.confirm(`Yakin ingin menghapus Kamar ${nomor_kamar}? Tindakan ini tidak dapat dibatalkan.`)) {
            startTransition(async () => {
                await hapusKamar(id);
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            title="Hapus Kamar"
            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center text-sm disabled:opacity-50"
        >
            {isPending ? "⏳" : "🗑️"}
        </button>
    );
}
