"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search } from "lucide-react";

export default function SearchPenghuni() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        if (e.target.value) {
            params.set("query", e.target.value);
        } else {
            params.delete("query");
        }

        // Kembali ke halaman 1 setiap kali pencarian berubah
        params.delete("page");

        // Debounce simple: replace instead of push, and do it onChange
        router.replace(`/admin/penghuni?${params.toString()}`);
    }, [router, searchParams]);

    return (
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#9AA3B4]">
                <Search className="h-4 w-4" strokeWidth={2} />
            </span>
            <input
                type="text"
                defaultValue={searchParams.get("query")?.toString()}
                onChange={handleSearch}
                placeholder="Cari nama atau nomor kamar..."
                className="pl-10 pr-4 py-2 border border-[#EAEDF3] rounded-lg text-sm text-[#384151] bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary w-full sm:w-80 transition-shadow"
            />
        </div>
    );
}
