"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Hospitalero } from "@/lib/definitions";
import { HospitalerosTableActions } from "./hospitaleros-table-actions";

const availabilityMap: Record<Hospitalero['disponibilidad'], { text: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    'todo-el-ano': { text: 'Todo el año', variant: 'default' },
    'verano': { text: 'Verano', variant: 'secondary' },
    'invierno': { text: 'Invierno', variant: 'secondary' },
    'fines-de-semana': { text: 'Fines de semana', variant: 'outline' },
};

export function HospitalerosTable({ data }: { data: Hospitalero[] }) {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Disponibilidad</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((hospitalero, index) => {
                const availability = availabilityMap[hospitalero.disponibilidad];
                return (
                  <TableRow key={hospitalero.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{hospitalero.nombre} {hospitalero.apellido}</TableCell>
                    <TableCell className="text-muted-foreground">{hospitalero.direccion}</TableCell>
                    <TableCell className="text-muted-foreground">{hospitalero.telefono}</TableCell>
                    <TableCell>
                      <Badge variant={availability.variant}>{availability.text}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{hospitalero.notas}</TableCell>
                    <TableCell className="text-right">
                      <HospitalerosTableActions hospitalero={hospitalero} />
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No hay hospitaleros registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
