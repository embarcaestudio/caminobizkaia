"use client";

import * as React from "react";
import Image from "next/image";
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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { HospitalerosTableActions } from "./hospitaleros-table-actions";
import { useIsMobile } from "@/hooks/use-mobile";

const availabilityMap: Record<Hospitalero['disponibilidad'], { text: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    'todo-el-ano': { text: 'Todo el año', variant: 'default' },
    'verano': { text: 'Verano', variant: 'secondary' },
    'invierno': { text: 'Invierno', variant: 'secondary' },
    'fines-de-semana': { text: 'Fines de semana', variant: 'outline' },
};

export function HospitalerosTable({ data }: { data: Hospitalero[] }) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <div className="space-y-4">
                {data.map((hospitalero) => (
                    <Card key={hospitalero.id}>
                        <CardContent className="flex items-start gap-4 p-4">
                             <div className="relative h-12 w-12 flex-shrink-0">
                                <Image
                                    src={PlaceHolderImages.find(p => p.id === hospitalero.avatar)?.imageUrl || `https://picsum.photos/seed/${hospitalero.id}/200/200`}
                                    alt={`${hospitalero.nombre} ${hospitalero.apellido}`}
                                    data-ai-hint="person smiling"
                                    className="rounded-full object-cover"
                                    fill
                                />
                            </div>
                            <div className="flex-grow space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{hospitalero.nombre} {hospitalero.apellido}</p>
                                    <HospitalerosTableActions hospitalero={hospitalero} />
                                </div>
                                <p className="text-sm text-muted-foreground">{hospitalero.direccion}</p>
                                <p className="text-sm text-muted-foreground">{hospitalero.telefono}</p>
                                <div>
                                    <Badge variant={availabilityMap[hospitalero.disponibilidad].variant}>
                                        {availabilityMap[hospitalero.disponibilidad].text}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Disponibilidad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((hospitalero) => {
                const avatar = PlaceHolderImages.find(p => p.id === hospitalero.avatar);
                const availability = availabilityMap[hospitalero.disponibilidad];
                return (
                  <TableRow key={hospitalero.id}>
                    <TableCell>
                      <div className="relative h-10 w-10">
                        <Image
                            src={avatar?.imageUrl || `https://picsum.photos/seed/${hospitalero.id}/200/200`}
                            alt={`${hospitalero.nombre} ${hospitalero.apellido}`}
                            data-ai-hint="person smiling"
                            className="rounded-full object-cover"
                            fill
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{hospitalero.nombre} {hospitalero.apellido}</TableCell>
                    <TableCell className="text-muted-foreground">{hospitalero.direccion}</TableCell>
                    <TableCell className="text-muted-foreground">{hospitalero.telefono}</TableCell>
                    <TableCell>
                      <Badge variant={availability.variant}>{availability.text}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <HospitalerosTableActions hospitalero={hospitalero} />
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
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
