"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HospitaleroSchema, type Hospitalero } from "@/lib/definitions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type HospitaleroFormValues = z.infer<typeof HospitaleroSchema>;

interface HospitaleroFormProps {
  hospitalero?: Hospitalero;
  onSuccess: () => void;
  formAction: (data: FormData) => Promise<{ success: boolean; message?: string; errors?: any }>;
}

export function HospitaleroForm({ hospitalero, onSuccess, formAction }: HospitaleroFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<HospitaleroFormValues>({
    resolver: zodResolver(HospitaleroSchema),
    defaultValues: {
      id: hospitalero?.id,
      nombre: hospitalero?.nombre || "",
      apellido: hospitalero?.apellido || "",
      direccion: hospitalero?.direccion || "",
      telefono: hospitalero?.telefono || "",
      disponibilidad: hospitalero?.disponibilidad || undefined,
      notas: hospitalero?.notas || "",
    },
  });

  async function onSubmit(values: HospitaleroFormValues) {
    setServerError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const result = await formAction(formData);
    
    if (result?.success) {
      onSuccess();
    } else if (result?.message) {
      // This is a server error if the `errors` object is not present
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="direccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Calle Falsa 123, Bilbao" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="+34 611 223 344" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="disponibilidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disponibilidad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="todo-el-ano">Todo el año</SelectItem>
                    <SelectItem value="verano">Verano</SelectItem>
                    <SelectItem value="invierno">Invierno</SelectItem>
                    <SelectItem value="fines-de-semana">Fines de semana</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea placeholder="Añadir notas adicionales..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error al Guardar</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Guardando...' : (hospitalero ? 'Guardar Cambios' : 'Añadir Hospitalero')}
        </Button>
      </form>
    </Form>
  );
}
