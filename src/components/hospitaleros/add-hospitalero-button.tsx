"use client";

import { useState, useEffect } from "react";
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
import { HospitaleroForm } from "./hospitalero-form";
import { createHospitalero } from "@/lib/actions";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddHospitaleroButton() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSuccess = () => {
    setOpen(false);
    toast({
      title: "Éxito",
      description: "El hospitalero ha sido añadido correctamente.",
      variant: "default",
    });
    router.refresh();
  };

  if (!isClient) {
    return (
      <Button
        className="bg-accent text-accent-foreground hover:bg-accent/90"
        disabled
      >
        <PlusCircle />
        Añadir Hospitalero
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle />
          Añadir Hospitalero
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Añadir Nuevo Hospitalero
          </DialogTitle>
          <DialogDescription>
            Rellene el formulario para añadir un nuevo miembro a la lista.
          </DialogDescription>
        </DialogHeader>
        <HospitaleroForm
          onSuccess={handleSuccess}
          formAction={createHospitalero}
        />
      </DialogContent>
    </Dialog>
  );
}
