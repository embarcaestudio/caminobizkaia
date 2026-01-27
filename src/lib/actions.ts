'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  addHospitalero as dbAddHospitalero,
  updateHospitalero as dbUpdateHospitalero,
  deleteHospitalero as dbDeleteHospitalero,
} from './data';
import { HospitaleroSchema } from './definitions';
import mysql from 'mysql2/promise';


export async function authenticate(
  prevState: string | undefined,
  formData: FormData
): Promise<string> {
  const username = formData.get('username');
  const password = formData.get('password');

  // MOCK LOGIN
  if (username === 'CaminoBBDD' && password === 'Camino&%&%2023') {
    // In a real app you would set a session cookie here.
    redirect('/dashboard');
  }
  return 'Usuario o contraseña incorrectos.';
}

export async function testDbConnection(
  formData: FormData
): Promise<{ message: string; success: boolean }> {
    const host = formData.get('host') as string;
    const database = formData.get('database') as string;
    const user = formData.get('user') as string;
    const password = formData.get('password') as string;

    try {
        const connection = await mysql.createConnection({ host, user, password, database });
        await connection.end();
        return {
            success: true,
            message: 'La conexión con la base de datos se ha establecido correctamente.',
        };
    } catch (error: any) {
         return {
            success: false,
            message: `No se pudo conectar a la base de datos. Error: ${error.message}`,
        };
    }
}


export async function createHospitalero(formData: FormData) {
  const validatedFields = HospitaleroSchema.safeParse({
    nombre: formData.get('nombre'),
    apellido: formData.get('apellido'),
    direccion: formData.get('direccion'),
    telefono: formData.get('telefono'),
    disponibilidad: formData.get('disponibilidad'),
    notas: formData.get('notas'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos. No se pudo crear el hospitalero.',
    };
  }

  // We don't need id or avatar for creation.
  const { id, avatar, ...dataToCreate } = validatedFields.data;

  try {
    // Ensure notas is a string.
    await dbAddHospitalero({
      ...dataToCreate,
      notas: dataToCreate.notas || '',
    });
  } catch (error: any) {
    return {
      message: error.message || 'Error de base de datos: no se pudo crear el hospitalero.',
    };
  }

  revalidatePath('/dashboard');
}

export async function updateHospitalero(id: string, formData: FormData) {
  const validatedFields = HospitaleroSchema.safeParse({
    nombre: formData.get('nombre'),
    apellido: formData.get('apellido'),
    direccion: formData.get('direccion'),
    telefono: formData.get('telefono'),
    disponibilidad: formData.get('disponibilidad'),
    notas: formData.get('notas'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos. No se pudo actualizar el hospitalero.',
    };
  }

  const { id: validatedId, avatar, ...dataToUpdate } = validatedFields.data;

  try {
    await dbUpdateHospitalero(id, {
      ...dataToUpdate,
      notas: dataToUpdate.notas || '',
    });
  } catch (error: any) {
    return {
      message: error.message || 'Error de base de datos: no se pudo actualizar el hospitalero.',
    };
  }

  revalidatePath('/dashboard');
}

export async function deleteHospitalero(id: string) {
  try {
    const success = await dbDeleteHospitalero(id);
    if (success) {
      revalidatePath('/dashboard');
      return { success: true, message: 'Hospitalero eliminado.' };
    }
    return {
      success: false,
      message: 'No se pudo eliminar el hospitalero.',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error de base de datos: no se pudo eliminar el hospitalero.',
    };
  }
}
