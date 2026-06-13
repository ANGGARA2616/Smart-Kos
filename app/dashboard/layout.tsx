import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProfileDropdown from "@/components/ProfileDropdown";
import WelcomeGuideDialog from "@/components/dashboard/WelcomeGuideDialog";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (!session || session.role !== "USER") {
        redirect("/login");
    }

    const profile = await prisma.kostProfile.findFirst();
    const nama_kost = profile?.nama_kost || "Dashboard Pengguna";

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { nama: true },
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            {profile?.logo_url ? (
                                <img src={profile.logo_url} alt={`${nama_kost} logo`} className="h-8 w-auto min-w-[32px] max-w-[150px] object-contain rounded-md" />
                            ) : (
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                                    {nama_kost.charAt(0)}
                                </div>
                            )}
                            <span className="font-bold text-xl text-gray-900 truncate max-w-[180px] sm:max-w-xs">{nama_kost}</span>
                        </div>
                        <ProfileDropdown userName={user?.nama || "Penghuni"} />
                    </div>
                </div>
            </nav>
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <WelcomeGuideDialog />
                {children}
            </main>
        </div>
    );
}
