"use client";

import Link from "next/link";
import { Menu, Home, User, LogOut, Ticket, LogIn, LayoutDashboard, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useState } from "react";

interface MobileNavProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => Promise<void>;
}

export default function MobileNav({ isAuthenticated, isAdmin, onLogout }: MobileNavProps) {
  const [open, setOpen] = useState<boolean>(false);

  const routes = [
    { href: "/", label: "Anasayfa", icon: Home },
    ...(isAdmin
      ? [{ href: "/admin", label: "Yönetim Paneli", icon: LayoutDashboard }]
      : []),
    ...(isAuthenticated
      ? [
        { href: "/favorite", label: "Favorilerim", icon: Heart },
        { href: "/my-account", label: "Profilim", icon: User }
      ]
      : []),
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-6 h-6" />
          <span className="sr-only">Menüyü aç</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] flex flex-col">
        <SheetHeader className="text-left border-b pb-6">
          <SheetTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Ticket className="w-6 h-6 text-primary" />
            </div>
            <span>Event Scale</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-2 flex-1 mt-6">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-lg font-medium hover:bg-muted rounded-xl transition-all duration-200"
              >
                <Icon className="w-5 h-5" />
                {route.label}
              </Link>
            );
          })}

          <div className="my-2 border-t" />

          {isAuthenticated ? (
            <button
              onClick={async () => {
                await onLogout();
                setOpen(false);
              }}
              className="flex w-full items-center gap-4 px-4 py-3 text-lg font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              Çıkış Yap
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 px-4 py-3 text-lg font-medium hover:bg-muted rounded-xl transition-all duration-200"
            >
              <LogIn className="w-5 h-5" />
              Giriş Yap
            </Link>
          )}
        </nav>

        <SheetFooter className="mt-auto border-t pt-6">
          <p className="text-xs text-center text-muted-foreground w-full">
            © 2026 Event Scale. Tüm hakları saklıdır.
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}