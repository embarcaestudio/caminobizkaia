"use client";

import { useFormStatus } from "react-dom";
import { testDbConnection } from "@/lib/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import React, { useActionState } from "react";

export function DbSettingsForm() {
  const [state, formAction] = useActionState(testDbConnection, null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast({
        title: "Conexión Exitosa",
        description: state.message,
      });
    } else {
      toast({
        title: "Error de Conexión",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="host">Host</Label>
        <Input id="host" name="host" placeholder="ej. sql123.cdmon.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="database">Nombre de la Base de Datos</Label>
        <Input id="database" name="database" placeholder="ej. mi_base_de_datos" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="user">Usuario</Label>
        <Input id="user" name="user" placeholder="ej. usuario_db" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto" aria-disabled={pending}>
      {pending ? "Probando..." : "Test Conexión"}
    </Button>
  );
}
