"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserForm } from "./user-form";
import { createUser } from "@/lib/actions";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddUserButton() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSuccess = () => {
    setOpen(false);
    toast({
        title: "Éxito",
        description: "El usuario ha sido añadido correctamente.",
        variant: "default",
    });
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle />
          Añadir Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Añadir Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Rellene el formulario para dar de alta un nuevo usuario.
          </DialogDescription>
        </DialogHeader>
        <UserForm onSuccess={handleSuccess} formAction={createUser} />
      </DialogContent>
    </Dialog>
  );
}
