import { auth } from "@/auth/authSetup";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
    })

    if (user?.role !== "ADMIN") {
        redirect("/");
    }

    return <>{children}</>;
}