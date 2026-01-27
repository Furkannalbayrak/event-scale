import { auth } from "@/auth/authSetup";
import { redirect } from "next/navigation";
import { User, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-lg border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 mb-4 shadow-inner">
             {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                    src={user.image} 
                    alt={user.name || "User"} 
                    className="w-full h-full rounded-full object-cover"
                />
             ) : (
                <span className="text-4xl font-bold text-white uppercase">
                    {user?.name?.charAt(0) || "U"}
                </span>
             )}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            {user?.name || "Kullanıcı"}
          </h1>
          <p className="text-blue-100 mt-1 font-medium opacity-90">Hesap Bilgileri</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 transition-colors hover:bg-gray-100">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-4">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</p>
                <p className="text-gray-900 font-semibold">{user?.name || "Belirtilmemiş"}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 transition-colors hover:bg-gray-100">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mr-4">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Adresi</p>
                <p className="text-gray-900 font-semibold truncate">{user?.email}</p>
              </div>
            </div>

             <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 transition-colors hover:bg-gray-100">
              <div className="p-2 bg-green-100 rounded-lg text-green-600 mr-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hesap Durumu</p>
                <p className="text-gray-900 font-semibold">
                    <span className="flex items-center gap-2">
                        Aktif
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    </span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100 flex justify-center">
             <Button variant="outline" asChild>
                <Link href="/">Ana Sayfaya Dön</Link>
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;