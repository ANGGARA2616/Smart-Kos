"use client";

import { useState, useTransition } from "react";
import { hapusKamar } from "@/app/admin/kamar/actions";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function DeleteKamarButton({ id, nomor_kamar }: { id: string, nomor_kamar: string }) {
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleConfirm = () => {
        startTransition(async () => {
            await hapusKamar(id);
        });
        setShowConfirm(false);
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                disabled={isPending}
                title="Hapus Kamar"
                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center text-sm disabled:opacity-50"
            >
                {isPending ? <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span> : <span className="material-symbols-outlined text-[18px]">delete</span>}
            </button>

            <ConfirmModal
                open={showConfirm}
                title="Hapus Kamar"
                message={`Yakin ingin menghapus Kamar ${nomor_kamar}? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Ya, Hapus"
                variant="danger"
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}
