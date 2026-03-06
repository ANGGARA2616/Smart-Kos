import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (!session || session.role !== "USER") {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-base">
                                S
                            </div>
                            <span className="font-bold text-xl text-gray-900">Dashboard Pengguna</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600 text-sm font-medium">Halo, Penghuni!</span>
                            <form action={logoutAction}>
                                <button type="submit" className="text-sm text-red-600 font-semibold hover:underline">
                                    Keluar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>
        </div>
    );
}
