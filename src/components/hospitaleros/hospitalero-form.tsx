"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

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

type HospitaleroFormValues = z.infer<typeof HospitaleroSchema>;

interface HospitaleroFormProps {
  hospitalero?: Hospitalero;
  onSuccess: () => void;
  formAction: (data: FormData) => Promise<{ message: string; errors?: any } | void>;
}

export function HospitaleroForm({ hospitalero, onSuccess, formAction }: HospitaleroFormProps) {
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
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const result = await formAction(formData);
    
    // In a real app, you would handle server-side validation errors here
    // For this example, we assume success and close the dialog
    if (!result || !result.errors) {
       onSuccess();
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
        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Guardando...' : (hospitalero ? 'Guardar Cambios' : 'Añadir Hospitalero')}
        </Button>
      </form>
    </Form>
  );
}
