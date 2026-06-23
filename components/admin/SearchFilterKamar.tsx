"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchFilterKamar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get("query") as string;
        const status = formData.get("status") as string;
        const sort = formData.get("sort") as string;

        const params = new URLSearchParams(searchParams.toString());
        if (query) params.set("query", query);
        else params.delete("query");

        if (status) params.set("status", status);
        else params.delete("status");

        if (sort) params.set("sort", sort);
        else params.delete("sort");

        // Kembali ke halaman 1 setiap kali filter/pencarian/urutan berubah
        params.delete("page");

        router.push(`/admin/kamar?${params.toString()}`);
    }

    const selectClass = "border border-[#EAEDF3] rounded-lg px-3 py-2 text-sm text-[#384151] focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white";

    return (
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
                name="query"
                type="text"
                defaultValue={searchParams.get("query") || ""}
                placeholder="Cari kamar... (Tekan Enter)"
                className="border border-[#EAEDF3] rounded-lg px-3 py-2 text-sm text-[#384151] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 w-full sm:w-56 bg-white"
            />
            <select
                name="status"
                defaultValue={searchParams.get("status") || ""}
                onChange={(e) => e.target.form?.requestSubmit()}
                className={selectClass}
                aria-label="Filter status kamar"
            >
                <option value="">Semua Status</option>
                <option value="KOSONG">Kosong</option>
                <option value="TERISI">Terisi</option>
                <option value="PERBAIKAN">Perbaikan</option>
            </select>
            <select
                name="sort"
                defaultValue={searchParams.get("sort") || ""}
                onChange={(e) => e.target.form?.requestSubmit()}
                className={selectClass}
                aria-label="Urutkan kamar"
            >
                <option value="">Urutkan: Terbaru</option>
                <option value="nomor_asc">Urutkan: Nomor terkecil</option>
                <option value="nomor_desc">Urutkan: Nomor terbesar</option>
            </select>
            <button type="submit" className="hidden">Cari</button>
        </form>
    );
}
