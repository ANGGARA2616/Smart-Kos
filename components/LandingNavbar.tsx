"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { logoutAction } from "@/app/actions";

export default function LandingNavbar({ session, namaKost = "SmartKos" }: { session: any, namaKost?: string }) {
    const [activeMenu, setActiveMenu] = useState("beranda");

    const navLinks = [
        { name: "Beranda", href: "#", id: "beranda" },
        { name: "Lokasi", href: "#lokasi", id: "lokasi" },
        { name: "Kamar", href: "#kamar", id: "kamar" },
        { name: "Fasilitas", href: "#fasilitas", id: "fasilitas" },
        { name: "Tentang Kami", href: "#tentang", id: "tentang" },
    ];

    const handleNavClick = (id: string) => {
        setActiveMenu(id);
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-base">
                            S
                        </div>
                        <span className="font-bold text-xl text-gray-900">{namaKost}</span>
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex space-x-8 text-sm font-medium h-full">
                        {navLinks.map((link) => {
                            const isActive = activeMenu === link.id;
                            return (
                                <a
                                    key={link.id}
                                    href={link.href}
                                    onClick={() => handleNavClick(link.id)}
                                    className={`py-5 border-b-2 transition-colors flex items-center ${isActive
                                        ? "text-primary font-semibold border-primary"
                                        : "text-gray-500 border-transparent hover:text-gray-900"
                                        }`}
                                >
                                    {link.name}
                                </a>
                            );
                        })}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex items-center space-x-3">
                        {session ? (
                            <>
                                <Link href={session.role === "ADMIN" ? "/admin" : "/dashboard"}>
                                    <Button variant="primary" size="sm" className="shadow-md shadow-primary/20">
                                        Dashboard
                                    </Button>
                                </Link>
                                <form action={logoutAction}>
                                    <Button type="submit" variant="secondary" size="sm" className="bg-white border border-red-200 text-red-600 hover:bg-red-50">
                                        Keluar
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:inline-block">
                                    <Button variant="secondary" size="sm" className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-100">
                                        Masuk
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" size="sm" className="shadow-md shadow-primary/20">
                                        Daftar
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
