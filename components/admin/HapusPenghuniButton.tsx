"use client";

import { useTransition, useState } from "react";
import { hapusPenghuni } from "@/app/admin/penghuni/actions";

export default function HapusPenghuniButton({ userId, nama }: { userId: string; nama: string }) {
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = () => {
        startTransition(async () => {
            await hapusPenghuni(userId);
            setShowConfirm(false);
        });
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                title="Hapus Penghuni"
                className="w-8 h-8 rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center text-sm"
            >
                🗑
            </button>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 mx-auto flex items-center justify-center text-3xl mb-5">
                            ⚠️
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Penghapusan</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-6">
                            Apakah Anda yakin ingin menghapus <strong className="text-red-600">{nama}</strong> dari daftar penghuni? 
                            Tindakan ini akan mengeluarkan penghuni dari kamar dan <strong>menghapus seluruh riwayat data</strong> mereka secara permanen.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={isPending}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-md shadow-red-200 disabled:opacity-50"
                            >
                                {isPending ? "Menghapus..." : "Ya, Hapus Penghuni"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
