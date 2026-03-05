"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function hapusKamar(id: string) {
    await prisma.kamar.delete({
        where: { id }
    });
    revalidatePath("/admin/kamar");
}
