"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/actions";

export default function ProfileDropdown({ userName }: { userName: string }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initials = userName
        .split(" ")
        .map((n) => n.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2.5 rounded-full border border-[#EAEDF3] bg-white py-1 pl-1 pr-3 shadow-sm hover:bg-[#F8FAFD] transition-colors"
            >
                <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#2F6BFF,#7AA6FF)" }}
                >
                    {initials}
                </div>
                <span className="text-sm font-semibold text-[#0E1424] hidden sm:block max-w-[120px] truncate">
                    {userName}
                </span>
                <svg
                    className={`w-4 h-4 text-[#8A93A4] transition-transform hidden sm:block ${open ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-[scaleIn_150ms_ease-out]">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Penghuni</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5">
                        <Link
                            href="/dashboard/profil"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px] text-gray-400">settings</span>
                            Pengaturan Profil
                        </Link>
                        <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px] text-gray-400">dashboard</span>
                            Dashboard
                        </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-1.5">
                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left font-medium"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                Keluar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
