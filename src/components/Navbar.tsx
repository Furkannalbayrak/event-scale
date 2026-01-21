import Link from "next/link";
import { auth, signIn, signOut } from "@/auth/authSetup"; // auth.ts'den import ediyoruz
import { Button } from "./ui/button";
import Image from "next/image";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b p-4 flex justify-between items-center bg-white shadow-sm">
      <Link href="/" className="text-xl font-bold">
        Event Scale
      </Link>

      <div>
        {session && session.user ? (
          <div className="flex gap-4 items-center">
            <span>Hoşgeldin, {session.user.name}</span>
            <form
              action={async () => {
                "use server"
                await signOut()
              }}
            >
              <div>
                <Button variant="outline" type="submit">Çıkış Yap</Button>
                <Image 
                  src={session.user.image || ""}
                  alt={session.user.name || ""}
                  className="rounded-full w-4 h-4 object-cover"
                  width={12}
                  height={12}
                />
              </div>
            </form>
          </div>
        ) : (
          <form
            action={async () => {
              "use server"
              await signIn("google")
            }}
          >
            <Button type="submit">Giriş Yap</Button>
          </form>
        )}
      </div>
    </nav>
  );
}