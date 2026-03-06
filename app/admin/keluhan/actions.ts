"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { StatusTiket } from "@generated/prisma";

export async function updateTiketStatus(id: string, newStatus: StatusTiket) {
    await prisma.tiket.update({
        where: { id },
        data: { status: newStatus }
    });

    revalidatePath("/admin/keluhan");
}
