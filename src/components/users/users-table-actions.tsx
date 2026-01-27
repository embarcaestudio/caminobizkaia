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
import { UserForm } from "./user-form";
import { DeleteUserDialog } from "./delete-user-dialog";

import type { User } from "@/lib/definitions";
import { updateUser } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export function UsersTableActions({ user }: { user: User }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    toast({
        title: "Actualizado",
        description: "Los datos del usuario han sido actualizados.",
    });
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    router.refresh();
     toast({
        title: "Eliminado",
        description: "El usuario ha sido eliminado.",
    });
  };
  
  const handleUpdateAction = updateUser.bind(null, user.id);

  if (!isClient) {
      return (
          <Button variant="ghost" className="h-8 w-8 p-0" disabled>
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
      )
  }

  // Admin user cannot be edited or deleted
  if (user.username === 'CaminoBBDD') {
      return null;
  }

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
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Editar Usuario</DialogTitle>
            <DialogDescription>
              Actualiza los datos de {user.username}.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={user}
            onSuccess={handleEditSuccess}
            formAction={handleUpdateAction}
          />
        </DialogContent>
      </Dialog>
      
      <DeleteUserDialog
        userId={user.id}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
