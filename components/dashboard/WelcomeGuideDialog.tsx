"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "smartkos-dashboard-welcome-seen";
const STORAGE_EVENT = "smartkos-dashboard-welcome-updated";

const GUIDE_ITEMS = [
    {
        icon: "bed",
        title: "Pantau kamar dan status sewa",
        text: "Lihat detail kamar, masa sewa, dan status pembayaran langsung dari dashboard.",
    },
    {
        icon: "receipt_long",
        title: "Ajukan pemesanan atau perpanjangan",
        text: "Pilih kamar kosong atau perpanjang sewa aktif, lalu ikuti instruksi pembayaran.",
    },
    {
        icon: "build",
        title: "Laporkan kerusakan fasilitas",
        text: "Gunakan menu laporan kerusakan agar admin dapat mencatat dan menindaklanjuti kendala.",
    },
    {
        icon: "support_agent",
        title: "Hubungi pengelola",
        text: "Gunakan akses kontak pengelola jika ada pertanyaan administrasi atau kebutuhan mendesak.",
    },
];

function subscribeToWelcomeStatus(callback: () => void) {
    window.addEventListener("storage", callback);
    window.addEventListener(STORAGE_EVENT, callback);

    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(STORAGE_EVENT, callback);
    };
}

function getWelcomeStatusSnapshot() {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
}

function getWelcomeStatusServerSnapshot() {
    return true;
}

export default function WelcomeGuideDialog() {
    const hasSeenWelcome = useSyncExternalStore(
        subscribeToWelcomeStatus,
        getWelcomeStatusSnapshot,
        getWelcomeStatusServerSnapshot
    );
    const open = !hasSeenWelcome;

    const closeDialog = useCallback(() => {
        window.localStorage.setItem(STORAGE_KEY, "true");
        window.dispatchEvent(new Event(STORAGE_EVENT));
    }, []);

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeDialog();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [closeDialog, open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={closeDialog} />

            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="bg-primary px-6 py-5 text-white">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Panduan Penghuni</p>
                            <h2 className="mt-2 text-xl font-extrabold leading-tight">Selamat datang di dashboard SmartKos</h2>
                        </div>
                        <button
                            type="button"
                            onClick={closeDialog}
                            className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
                            aria-label="Tutup panduan"
                        >
                            <span className="material-symbols-outlined text-[22px]">close</span>
                        </button>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/85">
                        Kenali fitur utama berikut supaya proses sewa dan komunikasi dengan admin lebih mudah.
                    </p>
                </div>

                <div className="space-y-3 px-6 py-5">
                    {GUIDE_ITEMS.map((item) => (
                        <div key={item.title} className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                                <p className="mt-1 text-xs leading-relaxed text-gray-500">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-100 bg-white px-6 py-4">
                    <button
                        type="button"
                        onClick={closeDialog}
                        className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dim focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Mulai Gunakan Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
