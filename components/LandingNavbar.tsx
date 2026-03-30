"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { logoutAction } from "@/app/actions";

export default function LandingNavbar({ session, namaKost = "SmartKos", logoUrl }: { session: any, namaKost?: string, logoUrl?: string | null }) {
    const [activeMenu, setActiveMenu] = useState("beranda");
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: "Beranda", href: "#", id: "beranda" },
        { name: "Kamar", href: "#kamar", id: "kamar" },
        { name: "Fasilitas", href: "#fasilitas", id: "fasilitas" },
        { name: "Lokasi", href: "#lokasi", id: "lokasi" },
        { name: "Testimoni", href: "#tentang", id: "tentang" },
    ];

    const handleNavClick = (id: string) => {
        setActiveMenu(id);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled 
                    ? 'bg-white/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,55,74,0.08)]' 
                    : 'bg-transparent border-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between h-[72px] items-center">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            {logoUrl ? (
                                <img src={logoUrl} alt={`${namaKost} logo`} className="h-11 w-auto min-w-[44px] max-w-[160px] object-contain" />
                            ) : (
                                <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                                    {namaKost.charAt(0)}
                                </div>
                            )}
                            <span className={`font-extrabold text-xl tracking-tight truncate max-w-[200px] sm:max-w-xs transition-colors ${
                                scrolled ? 'text-on-surface' : 'text-white'
                            }`}>
                                {namaKost}
                            </span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = activeMenu === link.id;
                                return (
                                    <a
                                        key={link.id}
                                        href={link.href}
                                        onClick={() => handleNavClick(link.id)}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                            isActive
                                                ? scrolled 
                                                    ? "bg-primary/10 text-primary" 
                                                    : "bg-white/20 text-white"
                                                : scrolled
                                                    ? "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                                        }`}
                                    >
                                        {link.name}
                                    </a>
                                );
                            })}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-3">
                            {session ? (
                                <>
                                    <Link href={session.role === "ADMIN" ? "/admin" : "/dashboard"}>
                                        <button className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dim hover:shadow-primary/40 transition-all active:scale-95">
                                            Dashboard
                                        </button>
                                    </Link>
                                    <form action={logoutAction}>
                                        <button type="submit" className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all active:scale-95 ${
                                            scrolled 
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                                                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                                        }`}>
                                            Keluar
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="hidden md:inline-block">
                                        <button className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all active:scale-95 ${
                                            scrolled 
                                                ? 'text-primary hover:bg-primary/5' 
                                                : 'text-white hover:bg-white/10'
                                        }`}>
                                            Masuk
                                        </button>
                                    </Link>
                                    <Link href="/register" className="hidden md:inline-block">
                                        <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dim hover:shadow-primary/40 transition-all active:scale-95">
                                            Daftar
                                        </button>
                                    </Link>
                                </>
                            )}

                            {/* Mobile Menu Button */}
                            <button 
                                className="md:hidden p-2 rounded-xl transition-colors"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <span className={`material-symbols-outlined text-2xl ${scrolled ? 'text-on-surface' : 'text-white'}`}>
                                    {mobileMenuOpen ? 'close' : 'menu'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className={`absolute top-[72px] left-0 right-0 shadow-2xl animate-fade-in-up backdrop-blur-xl ${
                        scrolled
                            ? 'bg-white/95 border-b border-gray-100'
                            : 'bg-on-surface/80 border-b border-white/10'
                    }`}>
                        <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
                            {navLinks.map((link) => {
                                const isActive = activeMenu === link.id;
                                return (
                                    <a
                                        key={link.id}
                                        href={link.href}
                                        onClick={() => handleNavClick(link.id)}
                                        className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                            isActive
                                                ? scrolled
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-white/15 text-white"
                                                : scrolled
                                                    ? "text-on-surface-variant hover:bg-surface-container-low"
                                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                                        }`}
                                    >
                                        {link.name}
                                    </a>
                                );
                            })}

                            {/* Auth buttons in mobile menu */}
                            {!session && (
                                <div className={`pt-3 mt-2 space-y-2 ${scrolled ? 'border-t border-gray-200' : 'border-t border-white/10'}`}>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                            scrolled
                                                ? 'text-on-surface-variant hover:bg-surface-container-low'
                                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-3 rounded-xl text-sm font-bold bg-primary text-white text-center hover:bg-primary-dim transition-all active:scale-95"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
