"use client";

import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState, useTransition } from "react";
import { registerUser } from "./actions";

export default function RegisterForm() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);

        if (formData.get("password") !== formData.get("konfirmasi_password")) {
            setError("Password dan Konfirmasi Password tidak cocok.");
            return;
        }

        startTransition(async () => {
            const res = await registerUser(formData);
            if (res?.error) {
                setError(res.error);
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
            <Card className="w-full max-w-md shadow-lg border-none">
                <CardBody className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Daftar SmartKos</h1>
                        <p className="text-gray-500 text-sm mt-2">Buat akun untuk memesan kamar idamanmu.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                            <input name="nama" type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm text-gray-900" placeholder="John Doe" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Email</label>
                            <input name="email" type="email" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm text-gray-900" placeholder="johndoe@email.com" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">No. Handphone (WA)</label>
                            <input name="no_hp" type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm text-gray-900" placeholder="081234567890" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm text-gray-900 pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 2 20 20" /><path d="M6.71 6.71A11 11 0 0 0 2 12s3 7 10 7a11 11 0 0 0 5.29-1.37" /><path d="M10.29 10.29a3 3 0 0 0 4.42 4.42" /><path d="M22 12s-1.89-4.36-5.83-6.19" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Konfirmasi Password</label>
                            <div className="relative">
                                <input
                                    name="konfirmasi_password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm text-gray-900 pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 2 20 20" /><path d="M6.71 6.71A11 11 0 0 0 2 12s3 7 10 7a11 11 0 0 0 5.29-1.37" /><path d="M10.29 10.29a3 3 0 0 0 4.42 4.42" /><path d="M22 12s-1.89-4.36-5.83-6.19" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" variant="primary" className="w-full pt-3 pb-3 font-bold mt-2 shadow-md shadow-primary/20" disabled={isPending}>
                            {isPending ? "Mendaftarkan..." : "Daftar Akun"}
                        </Button>

                        <p className="text-center text-sm text-gray-500 mt-6 border-t border-gray-100 pt-6">
                            Sudah punya akun? <Link href="/login" className="text-primary font-semibold hover:underline">Masuk di sini</Link>
                        </p>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
