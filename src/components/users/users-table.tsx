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
import type { User } from "@/lib/definitions";
import { UsersTableActions } from "./users-table-actions";
import { CheckCircle, XCircle } from "lucide-react";


export function UsersTable({ data }: { data: User[] }) {

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Puede Añadir</TableHead>
              <TableHead>Puede Editar</TableHead>
              <TableHead>Puede Eliminar</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>
                        {user.can_add ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                    </TableCell>
                     <TableCell>
                        {user.can_edit ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                    </TableCell>
                     <TableCell>
                        {user.can_delete ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                    </TableCell>
                    <TableCell className="text-right">
                      <UsersTableActions user={user} />
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No hay usuarios registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
