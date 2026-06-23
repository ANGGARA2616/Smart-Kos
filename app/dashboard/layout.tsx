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
        <div className="theme-ngekos min-h-screen bg-[#F4F6FA] flex flex-col">
            <nav className="bg-white border-b border-[#EAEDF3] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2.5">
                            {profile?.logo_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={profile.logo_url} alt={`${nama_kost} logo`} className="h-8 w-auto min-w-[32px] max-w-[150px] object-contain rounded-md" />
                            ) : (
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base font-bold text-white" style={{ background: "linear-gradient(135deg,#2F6BFF,#7AA6FF)" }}>
                                    {nama_kost.charAt(0)}
                                </div>
                            )}
                            <span className="font-bold text-xl text-[#0E1424] truncate max-w-[180px] sm:max-w-xs">{nama_kost}</span>
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
