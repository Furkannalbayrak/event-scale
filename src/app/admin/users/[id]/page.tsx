import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/authSetup";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    User as UserIcon,
    Mail,
    ShieldAlert,
    Trash2,
    Ticket,
    Calendar,
    ShieldCheck
} from "lucide-react";
import { toggleUserRole, deleteUserAction } from "../actions";
import { DeleteUserButton } from "../DeleteUserButton";

interface UserDetailProps {
    params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailProps) {
    const { id } = await params;
    const session = await auth();

    // Kullanıcıyı, aldığı biletler ve o biletlerin etkinlik bilgileriyle birlikte çekiyoruz
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            tickets: {
                include: { event: true },
                orderBy: { purchaseDate: 'desc' }
            }
        }
    });

    if (!user) return notFound();

    // Kendini yönetmeyi engelleme kontrolü
    const isSelf = session?.user?.id === user.id;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/admin/users" className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                    <ChevronLeft size={18} /> Kullanıcı Listesine Dön
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* SOL: Profil ve İşlemler */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border p-6 text-center">
                            <div className="w-20 h-20 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 border-4 border-white shadow-sm">
                                {user.name?.charAt(0) || "U"}
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-sm text-gray-500 mb-6">{user.email}</p>

                            <div className="flex items-center justify-center gap-1 text-sm text-gray-400 mb-6">
                                <Calendar size={14} />
                                <span>Kayıt: {new Date(user.createdAt).toLocaleDateString("tr-TR")}</span>
                            </div>

                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mb-6 ${user.role === "ADMIN" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                }`}>
                                {user.role === "ADMIN" ? <ShieldCheck size={14} /> : <UserIcon size={14} />}
                                {user.role}
                            </div>

                            {!isSelf ? (
                                <div className="space-y-3 pt-6 border-t">
                                    <form action={toggleUserRole.bind(null, user.id, user.role || "USER")}>
                                        <Button variant="outline" className="w-full flex gap-2">
                                            <ShieldAlert size={16} />
                                            {user.role === "ADMIN" ? "Yetkiyi Al (USER yap)" : "ADMIN Yap"}
                                        </Button>
                                    </form>

                                    <DeleteUserButton userId={user.id} />
                                </div>
                            ) : (
                                <div className="pt-6 border-t">
                                    <p className="text-xs text-gray-400 italic">Kendi hesabınızda yetki/silme işlemi yapamazsınız.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SAĞ: Bilet Geçmişi */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Ticket className="text-blue-600" /> Satın Alınan Biletler
                            </h2>

                            <div className="space-y-4">
                                {user.tickets.length > 0 ? (
                                    user.tickets.map((ticket) => (
                                        <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                                    <Calendar size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{ticket.event.title}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        {new Date(ticket.event.date).toLocaleDateString("tr-TR")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-green-600">₺{ticket.event.price}</p>
                                                <p className="text-[10px] text-gray-400">ID: #{ticket.id.slice(-6)}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed rounded-xl text-gray-400">
                                        Kullanıcı henüz hiç bilet almamış.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}