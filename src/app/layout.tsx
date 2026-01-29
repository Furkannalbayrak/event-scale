import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth/authSetup";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Event Scale | Şehrin En İyi Etkinlikleri",
  description: "Tiyatro, konser ve etkinlik biletlerini bulun, favorileyin ve takip edin.",
  icons: {
    icon: "https://img.freepik.com/premium-vector/ticket-icon-vector-illustration-white-background_715029-45.jpg", 

  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const sessions = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Navbar />

        <main>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
