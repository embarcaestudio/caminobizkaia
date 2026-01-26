"use client";

import { useState } from "react";
import { testDbConnection } from "@/lib/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function DbSettingsForm() {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const result = await testDbConnection(formData);
    
    setIsPending(false);

    if (result.success) {
      toast({
        title: "Conexión Exitosa",
        description: result.message,
      });
    } else {
      toast({
        title: "Error de Conexión",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="host">Host</Label>
        <Input id="host" name="host" placeholder="ej. sql123.cdmon.com" required disabled={isPending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="database">Nombre de la Base de Datos</Label>
        <Input id="database" name="database" placeholder="ej. mi_base_de_datos" required disabled={isPending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="user">Usuario</Label>
        <Input id="user" name="user" placeholder="ej. usuario_db" required disabled={isPending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" name="password" type="password" required disabled={isPending} />
      </div>
      <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto" aria-disabled={isPending}>
        {isPending ? "Probando..." : "Test Conexión"}
      </Button>
    </form>
  );
}
