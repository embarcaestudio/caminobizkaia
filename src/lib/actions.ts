'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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


export async function authenticate(
  prevState: string | undefined,
  formData: FormData
): Promise<string> {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    // If DB is configured, use it for authentication
    if (process.env.DB_HOST) {
        try {
            const user = await getUserByUsername(username);

            if (!user || user.password !== password) {
                return 'Usuario o contraseña incorrectos.';
            }
            // In a real app you would set a session cookie here.
            redirect('/dashboard');
        } catch (error: any) {
            return error.message || 'Ha ocurrido un error al autenticar.'
        }
    }

    // Fallback to hardcoded admin if DB is not configured
    if (username === 'CaminoBBDD' && password === 'Camino&%&%2023') {
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

  const { id, avatar, ...dataToCreate } = validatedFields.data;

  try {
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
  } catch (error: any) {
     return {
      success: false,
      message: error.message || 'Error de base de datos: no se pudo eliminar el hospitalero.',
    };
  }
}

// --- User Actions ---

export async function createUser(formData: FormData) {
  const validatedFields = UserSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
    can_add: formData.get('can_add') === 'on',
    can_edit: formData.get('can_edit') === 'on',
    can_delete: formData.get('can_delete') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos. No se pudo crear el usuario.',
    };
  }
  
  if (!validatedFields.data.password) {
      return { errors: { password: ['La contraseña es obligatoria.'] }, message: "La contraseña es obligatoria." }
  }

  try {
    await dbAddUser(validatedFields.data);
  } catch (error: any) {
    return {
      message: error.message || 'Error de base de datos: no se pudo crear el usuario.',
    };
  }

  revalidatePath('/dashboard/users');
}

export async function updateUser(id: string, formData: FormData) {
  const validatedFields = UserSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
    can_add: formData.get('can_add') === 'on',
    can_edit: formData.get('can_edit') === 'on',
    can_delete: formData.get('can_delete') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos. No se pudo actualizar el usuario.',
    };
  }
  
  const { password, ...dataToUpdate} = validatedFields.data;
  const updateData: any = dataToUpdate;

  if (password) {
      updateData.password = password;
  }

  try {
    await dbUpdateUser(id, updateData);
  } catch (error: any) {
    return {
      message: error.message || 'Error de base de datos: no se pudo actualizar el usuario.',
    };
  }

  revalidatePath('/dashboard/users');
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
