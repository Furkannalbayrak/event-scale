import Link from "next/link";
import { auth, signOut } from "@/auth/authSetup";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { User, LogOut, LayoutDashboard, Ticket } from "lucide-react";

export default async function Navbar() {
  const session = await auth();
  let userRole = "USER";

  // Eğer oturum varsa, güncel rol bilgisini veritabanından çekelim
  if (session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });
    userRole = dbUser?.role || "USER";
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Ticket className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Event Scale
          </span>
        </Link>

        {/* SAĞ TARAF - AKSİYONLAR */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              {/* Sadece Adminlere Gözükür */}
              {userRole === "ADMIN" && (
                <Button variant="ghost" asChild className="hidden md:flex">
                  <Link href="/admin">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Yönetim Paneli
                  </Link>
                </Button>
              )}

              {/* Kullanıcı Menüsü */}
              <div className="flex items-center gap-3 pl-4 border-l">
                <Button variant="ghost" size="sm" asChild className="relative h-9 rounded-full px-3">
                  <Link href="/my-account" className="flex items-center gap-2">
                    <div className="bg-gray-100 p-1.5 rounded-full">
                      <User className="w-4 h-4 text-gray-700" />
                    </div>
                    <span className="font-medium text-sm text-gray-700">Hesabım</span>
                  </Link>
                </Button>

                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <Button variant="destructive" size="sm" className="gap-2">
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Çıkış</span>
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Giriş Yap</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}