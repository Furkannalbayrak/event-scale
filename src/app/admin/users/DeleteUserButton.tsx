"use client" // Bu butonun tarayıcıda çalışacağını belirtiyoruz

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteUserAction } from "./actions";

export function DeleteUserButton({ userId }: { userId: string }) {
  const handleDelete = async () => {
    const confirmed = confirm("Bu kullanıcıyı ve tüm biletlerini silmek istediğinize emin misiniz?");
    
    if (confirmed) {
      await deleteUserAction(userId);
    }
  };

  return (
    <Button 
      variant="destructive" 
      className="w-full flex gap-2"
      onClick={handleDelete}
    >
      <Trash2 size={16} /> Kullanıcıyı Sil
    </Button>
  );
}