"use client";

import { useState } from "react";
import { updateProfile, changePassword } from "./actions";

export default function ProfilForm({ user }: { user: { nama: string; email: string; no_hp: string } }) {
    const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingProfile(true);
        setProfileMsg(null);
        const formData = new FormData(e.currentTarget);
        const result = await updateProfile(formData);
        if (result.error) {
            setProfileMsg({ type: "error", text: result.error });
        } else if (result.success) {
            setProfileMsg({ type: "success", text: result.success });
        }
        setLoadingProfile(false);
    };

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingPassword(true);
        setPasswordMsg(null);
        const formData = new FormData(e.currentTarget);
        const result = await changePassword(formData);
        if (result.error) {
            setPasswordMsg({ type: "error", text: result.error });
        } else if (result.success) {
            setPasswordMsg({ type: "success", text: result.success });
            (e.target as HTMLFormElement).reset();
        }
        setLoadingPassword(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Profile Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl text-primary">person</span>
                        Informasi Profil
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Perbarui nama dan nomor HP Anda.</p>
                </div>
                <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
                        <input
                            type="text"
                            name="nama"
                            defaultValue={user.nama}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">Email tidak dapat diubah.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nomor HP</label>
                        <input
                            type="tel"
                            name="no_hp"
                            defaultValue={user.no_hp}
                            required
                            placeholder="08xxxxxxxxxx"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        />
                    </div>

                    {profileMsg && (
                        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
                            profileMsg.type === "success"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-600 border border-red-200"
                        }`}>
                            {profileMsg.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loadingProfile}
                        className="w-full py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50"
                    >
                        {loadingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl text-primary">lock</span>
                        Ganti Password
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Pastikan Anda menggunakan password yang kuat dan mudah diingat.</p>
                </div>
                <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password Lama</label>
                        <input
                            type="password"
                            name="current_password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password Baru</label>
                        <input
                            type="password"
                            name="new_password"
                            required
                            minLength={6}
                            placeholder="Minimal 6 karakter"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                        <input
                            type="password"
                            name="confirm_password"
                            required
                            minLength={6}
                            placeholder="Ulangi password baru"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        />
                    </div>

                    {passwordMsg && (
                        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
                            passwordMsg.type === "success"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-600 border border-red-200"
                        }`}>
                            {passwordMsg.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loadingPassword}
                        className="w-full py-2.5 bg-gray-900 text-white font-semibold text-sm rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loadingPassword ? "Mengubah..." : "Ubah Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
