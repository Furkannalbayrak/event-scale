"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function deleteEvent(id: string) {
    await prisma.event.delete({
        where: { id: id }
    })

    revalidatePath("/admin");
}