"use client"

import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { toggleUserRole } from "./actions";

interface ToggleRoleButtonProps {
    userId: string;
    currentRole: string;
}

export function ToggleRoleButton({ userId, currentRole }: ToggleRoleButtonProps) {
    const handleToggle = async () => {
        const actionText = currentRole === "ADMIN" 
            ? "ADMIN yetkisini alıp normal kullanıcı yapmak" 
            : "kullanıcıyı ADMIN yapmak";

        const confirmed = confirm(`Bu ${actionText} istediğinize emin misiniz?`);
        
        if (confirmed) {
            await toggleUserRole(userId, currentRole);
        }
    };

    return (
        <Button 
            variant="outline" 
            className="w-full flex gap-2" 
            onClick={handleToggle}
            type="button"
        >
            <ShieldAlert size={16} />
            {currentRole === "ADMIN" ? "Yetkiyi Al (USER yap)" : "ADMIN Yap"}
        </Button>
    );
}