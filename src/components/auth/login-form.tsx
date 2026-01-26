"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticate } from "@/lib/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(undefined);

    const formData = new FormData(event.currentTarget);
    const result = await authenticate(formData);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setErrorMessage(result.message);
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Usuario</Label>
        <Input
          id="username"
          name="username"
          placeholder="CaminoBBDD"
          required
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          disabled={isPending}
        />
      </div>
      <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" aria-disabled={isPending}>
        {isPending ? "Accediendo..." : "Acceder"}
      </Button>
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de Acceso</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
