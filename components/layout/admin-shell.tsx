"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, CalendarDays } from "lucide-react"
import AdminSidebar from "./admin-sidebar"

interface AdminShellProps {
    userNama?: string
    namaKost?: string
    logoUrl?: string | null
    pendingVerifikasi?: number
    today?: string
    children: React.ReactNode
}

// Judul halaman terpusat per-route → ditampilkan di header (konsisten di semua menu).
const PAGE_TITLES: Record<string, string> = {
    "/admin": "Ringkasan Dasbor",
    "/admin/kamar": "Manajemen Kamar",
    "/admin/kamar/tambah": "Tambah Kamar Baru",
    "/admin/penghuni": "Data Penghuni Aktif",
    "/admin/verifikasi": "Verifikasi Pembayaran",
    "/admin/keluhan": "Keluhan & Perbaikan Fasilitas",
    "/admin/laporan": "Laporan Keuangan",
    "/admin/pengaturan": "Pengaturan Kost",
}

function getPageTitle(pathname: string): string {
    if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
    if (/^\/admin\/kamar\/[^/]+\/edit$/.test(pathname)) return "Edit Data Kamar"
    return "Dasbor"
}

function initialsOf(name: string) {
    return (
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "A"
    )
}

export default function AdminShell({ userNama = "Admin", namaKost = "SmartKos", logoUrl, pendingVerifikasi = 0, today, children }: AdminShellProps) {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const pathname = usePathname()
    const title = getPageTitle(pathname)
    const showDate = pathname === "/admin" && !!today

    useEffect(() => {
        if (drawerOpen) {
            const prev = document.body.style.overflow
            document.body.style.overflow = "hidden"
            return () => {
                document.body.style.overflow = prev
            }
        }
    }, [drawerOpen])

    return (
        <div className="theme-ngekos flex h-screen overflow-hidden bg-[#F4F6FA]">
            <AdminSidebar
                namaKost={namaKost}
                logoUrl={logoUrl}
                pendingVerifikasi={pendingVerifikasi}
                isMobileOpen={drawerOpen}
                onMobileClose={() => setDrawerOpen(false)}
            />

            {drawerOpen && (
                <div
                    onClick={() => setDrawerOpen(false)}
                    className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]"
                    aria-hidden="true"
                />
            )}

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Mobile top bar */}
                <header className="lg:hidden flex h-14 shrink-0 items-center gap-3 border-b border-[#EAEDF3] bg-white px-4">
                    <button
                        type="button"
                        onClick={() => setDrawerOpen(true)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#384151] hover:bg-[#F1F3F8] hover:text-[#0E1424] transition-colors"
                        aria-label="Buka menu"
                    >
                        <Menu className="h-5 w-5" strokeWidth={2} />
                    </button>
                    <span className="truncate text-[15px] font-bold text-[#0E1424]">{title}</span>
                </header>

                {/* Desktop top header — page title (kiri) sejajar avatar (kanan) */}
                <header className="hidden lg:flex h-[62px] shrink-0 items-center justify-between gap-4 border-b border-[#EAEDF3] bg-white px-6">
                    <h1 className="min-w-0 truncate text-[18px] font-bold tracking-tight text-[#0E1424]">{title}</h1>
                    <div className="flex shrink-0 items-center gap-3">
                        {showDate && (
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#384151] bg-white border border-[#EAEDF3] rounded-xl px-3 py-1.5 shadow-sm">
                                <CalendarDays className="h-4 w-4 text-[#7B8597]" />
                                {today}
                            </span>
                        )}
                        <div className="flex items-center gap-2.5 rounded-full border border-[#EAEDF3] bg-white py-1 pl-1 pr-3 shadow-sm">
                            <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white" style={{ background: "linear-gradient(135deg,#2F6BFF,#7AA6FF)" }}>
                                {initialsOf(userNama)}
                            </div>
                            <div className="leading-tight">
                                <p className="text-[13px] font-semibold text-[#0E1424]">{userNama}</p>
                                <p className="text-[11px] text-[#7B8597]">Administrator</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-[#F4F6FA]">{children}</main>
            </div>
        </div>
    )
}
