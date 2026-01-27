"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HospitaleroForm } from "./hospitalero-form";
import { DeleteHospitaleroDialog } from "./delete-hospitalero-dialog";

import type { Hospitalero } from "@/lib/definitions";
import { updateHospitalero } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export function HospitalerosTableActions({ hospitalero }: { hospitalero: Hospitalero }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    toast({
        title: "Actualizado",
        description: "Los datos del hospitalero han sido actualizados.",
    });
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    toast({
        title: "Eliminado",
        description: "El hospitalero ha sido eliminado.",
    });
    router.refresh();
  };
  
  const handleUpdateAction = updateHospitalero.bind(null, hospitalero.id);
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {isClient && (
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Editar Hospitalero</DialogTitle>
              <DialogDescription>
                Actualiza los datos de {hospitalero.nombre} {hospitalero.apellido}.
              </DialogDescription>
            </DialogHeader>
            <HospitaleroForm
              hospitalero={hospitalero}
              onSuccess={handleEditSuccess}
              formAction={handleUpdateAction}
            />
          </DialogContent>
        )}
      </Dialog>
      
      <DeleteHospitaleroDialog
        hospitaleroId={hospitalero.id}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
