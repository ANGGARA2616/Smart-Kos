"use client";

import { useEffect } from "react";

export default function ChatbotWidget() {
    useEffect(() => {
        // Mencegah duplikasi dengan pengecekan spesifik
        if (document.getElementById('redforge-script-injector')) {
            return;
        }

        const script = document.createElement("script");
        script.id = "redforge-script-injector";
        // Tambahkan parameter ?v= agar browser selalu mengambil versi terbaru dan tidak terhalang cache
        script.src = "https://red-forge.vercel.app/widget.js?v=" + new Date().getTime();
        script.setAttribute("data-bot-id", "0be1ed19-5a82-4665-9c7e-c6c2435489f2");
        script.async = true;
        
        // Memasukkan script ke dalam body HTML di sisi Client
        document.body.appendChild(script);

        return () => {
            // Kita tidak menghapus script saat unmount agar state chat tidak hilang saat pindah halaman
        };
    }, []);

    return null; // Komponen ini tidak me-render UI bawaan Next.js, hanya script di background
}
