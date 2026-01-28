"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function IBBSyncButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sync-ibb", { method: "POST" });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Senkronizasyon hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSync} 
      disabled={loading} 
      variant="outline" 
      className="border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
    >
      <RefreshCw size={18} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Veriler Çekiliyor..." : "Veri Güncelle"}
    </Button>
  );
}