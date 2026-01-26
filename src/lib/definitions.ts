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
