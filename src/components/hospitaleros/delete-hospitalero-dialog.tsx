"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteHospitalero } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface DeleteHospitaleroDialogProps {
  hospitaleroId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteHospitaleroDialog({
  hospitaleroId,
  open,
  onOpenChange,
  onSuccess,
}: DeleteHospitaleroDialogProps) {
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleDelete = async () => {
        const result = await deleteHospitalero(hospitaleroId);
        if (result?.success) {
            onSuccess();
        } else {
             toast({
                title: "Error",
                description: result?.message || "No se pudo eliminar el hospitalero.",
                variant: "destructive",
            });
        }
    };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {isClient && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al hospitalero de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
