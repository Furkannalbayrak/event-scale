"use client" // Bu buton tarayıcıda çalışacak

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import deleteEvent from "./delete"
import { useRouter } from "next/navigation"

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmDelete = confirm("Bu etkinliği silmek istediğinize emin misiniz?")

    if (confirmDelete) {
      try {
        await deleteEvent(id);
        router.refresh();
      } catch (error) {
        alert("Silme işlemi başarısız oldu.");
      }
    }
  }

  return (
    <Button variant="destructive" size="icon" onClick={handleDelete}>
      <Trash2 size={18} />
    </Button>
  )
}