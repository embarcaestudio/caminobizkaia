import { z } from 'zod';

export type Hospitalero = {
  id: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  disponibilidad: 'todo-el-ano' | 'verano' | 'invierno' | 'fines-de-semana';
  notas: string;
  avatar: string;
};

export const HospitaleroSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  apellido: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres." }),
  direccion: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres." }),
  telefono: z.string().regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, { message: "Número de teléfono no válido." }),
  disponibilidad: z.enum(['todo-el-ano', 'verano', 'invierno', 'fines-de-semana'], {
    errorMap: () => ({ message: 'Por favor, seleccione una disponibilidad.' }),
  }),
  notas: z.string().optional(),
  avatar: z.string().optional(),
});


export const UserSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(3, { message: "El usuario debe tener al menos 3 caracteres." }),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres.").optional().or(z.literal('')),
  can_add: z.boolean().default(false),
  can_edit: z.boolean().default(false),
  can_delete: z.boolean().default(false),
});

export type User = {
  id: string;
  username: string;
  can_add: boolean;
  can_edit: boolean;
  can_delete: boolean;
};
