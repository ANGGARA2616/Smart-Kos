"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions";

const NAV_ITEMS = [
    { href: "/admin", label: "Dasbor", icon: "space_dashboard" },
    { href: "/admin/kamar", label: "Manajemen Kamar", icon: "bed" },
    { href: "/admin/penghuni", label: "Data Penghuni", icon: "group" },
    { href: "/admin/verifikasi", label: "Verifikasi Pembayaran", icon: "verified" },
    { href: "/admin/keluhan", label: "Keluhan Fasilitas", icon: "build" },
    { href: "/admin/laporan", label: "Laporan Keuangan", icon: "bar_chart" },
    { href: "/admin/pengaturan", label: "Pengaturan", icon: "settings" },
];

export default function AdminSidebar({ userNama, namaKost = "SmartKos", logoUrl }: { userNama: string, namaKost?: string, logoUrl?: string | null }) {
    const pathname = usePathname();
    const initials = userNama.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "A";

    return (
        <aside className="w-64 flex-shrink-0 bg-gray-900 text-white flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    {logoUrl ? (
                         <img src={logoUrl} alt="Logo" className="w-auto h-9 max-w-[120px] object-contain rounded-md" />
                    ) : (
                        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                            {namaKost.charAt(0)}
                        </div>
                    )}
                    <div className="flex flex-col overflow-hidden">
                        <p className="font-bold text-white text-base leading-tight truncate">{namaKost}</p>
                        <p className="text-gray-400 text-[11px] mt-0.5 whitespace-nowrap">Admin Server</p>
                    </div>
                </div>
            </div>


            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? "bg-primary text-white shadow-md shadow-primary/30"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

        </aside>
    );
}
