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

        const params = new URLSearchParams(searchParams.toString());
        if (query) params.set("query", query);
        else params.delete("query");

        if (status) params.set("status", status);
        else params.delete("status");

        router.push(`/admin/kamar?${params.toString()}`);
    }

    return (
        <form onSubmit={onSubmit} className="flex items-center gap-3">
            <input
                name="query"
                type="text"
                defaultValue={searchParams.get("query") || ""}
                placeholder="Cari kamar... (Tekan Enter)"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 w-56 bg-white"
            />
            <select
                name="status"
                defaultValue={searchParams.get("status") || ""}
                onChange={(e) => e.target.form?.requestSubmit()}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
            >
                <option value="">Semua Status</option>
                <option value="KOSONG">Kosong</option>
                <option value="TERISI">Terisi</option>
                <option value="PERBAIKAN">Perbaikan</option>
            </select>
            <button type="submit" className="hidden">Cari</button>
        </form>
    );
}
