"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserSchema, type User } from "@/lib/definitions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

type UserFormValues = z.infer<typeof UserSchema>;

interface UserFormProps {
  user?: User;
  onSuccess: () => void;
  formAction: (data: FormData) => Promise<{ success: boolean; message?: string; errors?: any }>;
}

export function UserForm({ user, onSuccess, formAction }: UserFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      id: user?.id,
      username: user?.username || "",
      password: "",
      can_add: user?.can_add || false,
      can_edit: user?.can_edit || false,
      can_delete: user?.can_delete || false,
    },
  });

  async function onSubmit(values: UserFormValues) {
    setServerError(null);
    const formData = new FormData();
    // Only append fields that have a value
    Object.entries(values).forEach(([key, value]) => {
        if (key === 'password' && !value) return; // Don't submit empty password
        formData.append(key, String(value));
    });

    const result = await formAction(formData);
    
    if (result?.success) {
       onSuccess();
    } else if (result?.message) {
      if (!result.errors) {
        setServerError(result.message);
      }
    } else {
       setServerError("Ha ocurrido un error inesperado al guardar los datos.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Nombre de Usuario</FormLabel>
                <FormControl>
                <Input placeholder="juan.perez" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                <Input type="password" placeholder={user ? "Dejar en blanco para no cambiar" : "Contraseña"} {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="space-y-2">
            <h3 className="text-sm font-medium">Permisos de Hospitaleros</h3>
             <FormField
                control={form.control}
                name="can_add"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">
                        Puede añadir hospitaleros
                    </FormLabel>
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="can_edit"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">
                        Puede editar hospitaleros
                    </FormLabel>
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="can_delete"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">
                        Puede eliminar hospitaleros
                    </FormLabel>
                    </FormItem>
                )}
                />
        </div>

        {serverError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error al Guardar</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Guardando...' : (user ? 'Guardar Cambios' : 'Añadir Usuario')}
        </Button>
      </form>
    </Form>
  );
}
