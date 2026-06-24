"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    BedDouble,
    Users,
    BadgeCheck,
    Wrench,
    BarChart3,
    Settings,
    HelpCircle,
    LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/app/actions"

interface AdminSidebarProps {
    namaKost?: string
    logoUrl?: string | null
    pendingVerifikasi?: number
    isMobileOpen?: boolean
    onMobileClose?: () => void
}

const NAV_ITEMS = [
    { href: "/admin", label: "Dasbor", exact: true, icon: LayoutDashboard },
    { href: "/admin/kamar", label: "Manajemen Kamar", icon: BedDouble },
    { href: "/admin/penghuni", label: "Data Penghuni", icon: Users },
    { href: "/admin/verifikasi", label: "Verifikasi Pembayaran", icon: BadgeCheck, badgeKey: "pendingVerifikasi" as const, badgeDanger: true },
    { href: "/admin/keluhan", label: "Keluhan Fasilitas", icon: Wrench },
    { href: "/admin/laporan", label: "Laporan Keuangan", icon: BarChart3 },
    { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
]

export default function AdminSidebar({
    namaKost = "SmartKos",
    logoUrl,
    pendingVerifikasi = 0,
    isMobileOpen = false,
    onMobileClose,
}: AdminSidebarProps) {
    const pathname = usePathname()
    const closeMobile = () => onMobileClose?.()

    const badges: Record<string, number> = { pendingVerifikasi }

    function isActive(href: string, exact = false) {
        return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/")
    }

    return (
        <aside
            className={cn(
                "flex h-full w-[280px] sm:w-[300px] lg:w-[248px] shrink-0 flex-col border-r border-[#EAEDF3] bg-white overflow-y-auto",
                "fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-out lg:static lg:translate-x-0 lg:shadow-none",
                isMobileOpen ? "translate-x-0 shadow-[0_10px_40px_rgba(16,24,40,.18)]" : "-translate-x-full lg:translate-x-0"
            )}
        >
            {/* Brand */}
            <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3 overflow-hidden">
                    {logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoUrl} alt={namaKost} className="h-9 w-auto max-w-[120px] object-contain rounded-md" />
                    ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-bold text-white" style={{ background: "linear-gradient(135deg,#2F6BFF,#7AA6FF)" }}>
                            {namaKost.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex min-w-0 flex-col">
                        <p className="truncate text-[15px] font-bold leading-tight text-[#0E1424]">{namaKost}</p>
                        <p className="mt-0.5 text-[11px] text-[#9AA3B4]">Admin Server</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={closeMobile}
                    className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-[#7B8597] hover:bg-[#F1F3F8] hover:text-[#0E1424] transition-colors"
                    aria-label="Tutup menu"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Main nav */}
            <p className="px-[22px] pt-1 pb-1.5 text-[11px] font-semibold uppercase tracking-[.08em] text-[#9AA3B4]">Menu</p>
            <nav className="flex flex-col gap-0.5 px-[14px]">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(item.href, item.exact)
                    const Icon = item.icon
                    const badge = item.badgeKey ? badges[item.badgeKey] : undefined
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMobile}
                            className={cn(
                                "flex items-center gap-[11px] rounded-[10px] px-3 py-[9px] text-[14px] font-medium transition-colors",
                                active
                                    ? "bg-[#EAF0FF] text-[#1A4FE0] font-semibold"
                                    : "text-[#384151] hover:bg-[#F1F3F8] hover:text-[#0E1424]"
                            )}
                        >
                            <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-[#2F6BFF]" : "text-[#8A93A4]")} strokeWidth={2} />
                            {item.label}
                            {badge != null && badge > 0 && (
                                <span
                                    className={cn(
                                        "ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                        item.badgeDanger ? "bg-[#FDECEC] text-[#E5484D]" : active ? "bg-white text-[#2F6BFF]" : "bg-[#EEF1F7] text-[#5A6477]"
                                    )}
                                >
                                    {badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Help */}
            <p className="mt-2 px-[22px] pb-1.5 text-[11px] font-semibold uppercase tracking-[.08em] text-[#9AA3B4]">Bantuan</p>
            <nav className="flex flex-col gap-0.5 px-[14px]">
                <a
                    href="/USER_MANUAL_SMARTKOS.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-[11px] rounded-[10px] px-3 py-[9px] text-[14px] font-medium text-[#384151] hover:bg-[#F1F3F8] hover:text-[#0E1424] transition-colors"
                >
                    <HelpCircle className="h-[18px] w-[18px] shrink-0 text-[#8A93A4]" strokeWidth={2} />
                    Panduan Admin
                </a>
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Logout */}
            <form action={logoutAction} className="mx-[14px] mb-[10px]">
                <button
                    type="submit"
                    className="flex w-full items-center gap-[11px] rounded-[10px] px-3 py-[9px] text-[13px] text-[#7B8597] hover:bg-[#F1F3F8] hover:text-[#E5484D] transition-colors"
                >
                    <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                    Keluar
                </button>
            </form>
        </aside>
    )
}
