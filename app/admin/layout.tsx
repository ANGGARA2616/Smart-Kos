import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/layout/admin-shell";
import prisma from "@/lib/prisma";

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

    const today = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <AdminShell
            userNama={adminUser?.nama || "Admin System"}
            namaKost={kostProfile?.nama_kost || "SmartKos"}
            logoUrl={kostProfile?.logo_url || null}
            pendingVerifikasi={pendingVerifikasi}
            today={today}
        >
            {children}
        </AdminShell>
    );
}
