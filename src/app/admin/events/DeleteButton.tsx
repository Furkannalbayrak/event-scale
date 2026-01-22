"use client" // Bu buton tarayıcıda çalışacak

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import deleteEvent from "./delete"

export function DeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    const confirmDelete = confirm("Bu etkinliği silmek istediğinize emin misiniz?")
    
    if (confirmDelete) {
      await deleteEvent(id)
    }
  }

  return (
    <Button variant="destructive" size="icon" onClick={handleDelete}>
      <Trash2 size={18} />
    </Button>
  )
}