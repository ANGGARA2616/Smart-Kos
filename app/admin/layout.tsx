import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import prisma from "@/lib/prisma";
import { logoutAction } from "@/app/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    const adminUser = await prisma.user.findUnique({
        where: { id: session.userId }
    });

    const kostProfile = await prisma.kostProfile.findFirst();

    const pendingVerifikasi = await prisma.booking.count({
        where: { status: "PENDING" }
    });

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <AdminSidebar 
                userNama={adminUser?.nama || "Admin System"} 
                namaKost={kostProfile?.nama_kost || "SmartKos"}
                logoUrl={kostProfile?.logo_url || null}
                pendingVerifikasi={pendingVerifikasi}
            />

            {/* ========== MAIN CONTENT ========== */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 flex-shrink-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 leading-tight">{adminUser?.nama || "Admin System"}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm uppercase">
                            {adminUser?.nama?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "A"}
                        </div>
                        <div className="h-6 w-px bg-gray-200 mx-2"></div>
                        <form action={logoutAction}>
                            <button type="submit" className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                Keluar
                            </button>
                        </form>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
