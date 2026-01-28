'use server';

import {
  addHospitalero as dbAddHospitalero,
  updateHospitalero as dbUpdateHospitalero,
  deleteHospitalero as dbDeleteHospitalero,
  getUserByUsername,
  addUser as dbAddUser,
  updateUser as dbUpdateUser,
  deleteUser as dbDeleteUser,
} from './data';
import { HospitaleroSchema, UserSchema } from './definitions';
import mysql from 'mysql2/promise';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';


export async function authenticate(
  prevState: string | undefined,
  formData: FormData
): Promise<string> {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    let user;
    
    // If DB is configured, use it for authentication
    if (process.env.DB_HOST) {
        try {
            user = await getUserByUsername(username);
        } catch (error: any) {
            // This will catch DB connection errors from query()
            return error.message || 'Ha ocurrido un error al autenticar.'
        }

        if (!user || user.password !== password) {
            return 'Usuario o contraseña incorrectos.';
        }
    } else {
        // Fallback to hardcoded admin if DB is not configured
        if (username === 'CaminoBBDD' && password === 'Camino&%&%2023') {
           // do nothing, let redirect happen
        } else {
            return 'Usuario o contraseña incorrectos.';
        }
    }
    
    // In a real app you would set a session cookie here.
    redirect('/dashboard');
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
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos. No se pudo crear el hospitalero.',
    };
  }

  const { id, avatar, ...dataToCreate } = validatedFields.data;

  try {
    await dbAddHospitalero({
      ...dataToCreate,
      notas: dataToCreate.notas || '',
    });
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error de base de datos: no se pudo crear el hospitalero.',
    };
  }

  revalidatePath('/dashboard');
  return { success: true };
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
      success: false,
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
      success: false,
      message: error.message || 'Error de base de datos: no se pudo actualizar el hospitalero.',
    };
  }

  revalidatePath('/dashboard');
  return { success: true };
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
  } catch (error: any) {
     return {
      success: false,
      message: error.message || 'Error de base de datos: no se pudo eliminar el hospitalero.',
    };
  }
}

// --- User Actions ---

function validateUserData(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    return UserSchema.safeParse({
        ...rawData,
        can_add: rawData.can_add === 'true',
        can_edit: rawData.can_edit === 'true',
        can_delete: rawData.can_delete === 'true',
    });
}

export async function createUser(formData: FormData) {
  const validatedFields = validateUserData(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos. No se pudo crear el usuario.',
    };
  }
  
  const { data } = validatedFields;

  if (!data.password) {
      return { success: false, errors: { password: ['La contraseña es obligatoria.'] }, message: "La contraseña es obligatoria." }
  }

  try {
    await dbAddUser(data);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error de base de datos: no se pudo crear el usuario.',
    };
  }

  revalidatePath('/dashboard/users');
  return { success: true };
}

export async function updateUser(id: string, formData: FormData) {
  const validatedFields = validateUserData(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos. No se pudo actualizar el usuario.',
    };
  }
  
  const updateData: Partial<z.infer<typeof UserSchema>> = { ...validatedFields.data };
  
  if (!updateData.password) {
      delete updateData.password;
  }

  try {
    await dbUpdateUser(id, updateData);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error de base de datos: no se pudo actualizar el usuario.',
    };
  }

  revalidatePath('/dashboard/users');
  return { success: true };
}

export async function deleteUser(id: string) {
  try {
    const success = await dbDeleteUser(id);
    if (success) {
      revalidatePath('/dashboard/users');
      return { success: true, message: 'Usuario eliminado.' };
    }
    return {
      success: false,
      message: 'No se pudo eliminar el usuario.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error de base de datos: no se pudo eliminar el usuario.',
    };
  }
}
