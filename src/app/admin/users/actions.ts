"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteUserAction(userId: string) {
  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}


export async function toggleUserRole(userId: string, currentRole: string) {
  const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/admin/users");
}


