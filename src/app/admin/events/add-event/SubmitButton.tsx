"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending} // İşlem sürerken butonu kilitler (Tıklanamaz yapar)
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-7 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-xl shadow-blue-100 transition-all"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin" size={22} />
          Kaydediliyor...
        </>
      ) : (
        <>
          <Save size={22} />
          Etkinliği Sisteme Kaydet
        </>
      )}
    </Button>
  );
}