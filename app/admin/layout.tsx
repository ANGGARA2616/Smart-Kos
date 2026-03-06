"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/admin", label: "Dasbor", icon: "⊞" },
    { href: "/admin/kamar", label: "Manajemen Kamar", icon: "🛏" },
    { href: "/admin/penghuni", label: "Data Penghuni", icon: "👥" },
    { href: "/admin/verifikasi", label: "Verifikasi Pembayaran", icon: "⏳" },
    { href: "/admin/keluhan", label: "Keluhan Fasilitas", icon: "🔧" },
    { href: "/admin/laporan", label: "Laporan Keuangan", icon: "📊" },
    { href: "/admin/pengaturan", label: "Pengaturan", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* ========== SIDEBAR ========== */}
            <aside className="w-64 flex-shrink-0 bg-gray-900 text-white flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-base">
                            S
                        </div>
                        <div>
                            <p className="font-bold text-white text-base leading-none">SmartKos</p>
                            <p className="text-gray-400 text-xs mt-0.5">Panel Admin</p>
                        </div>
                    </div>
                </div>

                {/* Profile */}
                <div className="p-5 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">
                            JA
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">James Anderson</p>
                            <p className="text-xs text-gray-400">Pemilik Properti</p>
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
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-800">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                        <span>↩</span>
                        Keluar
                    </button>
                </div>
            </aside>

            {/* ========== MAIN CONTENT ========== */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
