"use client";

import { useState } from "react";
import { testDbConnection } from "@/lib/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DbSettingsFormProps {
    currentConfig: {
        host?: string;
        database?: string;
        user?: string;
    }
}

export function DbSettingsForm({ currentConfig }: DbSettingsFormProps) {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);

  const handleTestSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsTesting(true);

    const formData = new FormData(event.currentTarget);
    const result = await testDbConnection(formData);

    setIsTesting(false);

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
    <form onSubmit={handleTestSubmit} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="host">Host</Label>
        <Input id="host" name="host" placeholder="ej. sql123.cdmon.com" required defaultValue={currentConfig.host || ''} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="database">Nombre de la Base de Datos</Label>
        <Input id="database" name="database" placeholder="ej. mi_base_de_datos" required defaultValue={currentConfig.database || ''} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="user">Usuario</Label>
        <Input id="user" name="user" placeholder="ej. usuario_db" required defaultValue={currentConfig.user || ''} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" name="password" type="password" placeholder="Contraseña de tu .env.local" required />
      </div>
      <div className="flex flex-wrap gap-4">
        <Button type="submit" className="flex-grow bg-accent text-accent-foreground hover:bg-accent/90 sm:flex-grow-0" aria-disabled={isTesting}>
          {isTesting ? "Probando..." : "Test Conexión"}
        </Button>
      </div>
    </form>
  );
}
