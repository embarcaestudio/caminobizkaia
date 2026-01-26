'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  addHospitalero as dbAddHospitalero,
  updateHospitalero as dbUpdateHospitalero,
  deleteHospitalero as dbDeleteHospitalero,
} from './data';
import { HospitaleroSchema } from './definitions';

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
  const host = formData.get('host');
  // MOCK DB CONNECTION
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // You can test the failure case by using 'fail' as the host.
  if (host === 'fail') {
    return {
      success: false,
      message: 'No se pudo conectar a la base de datos.',
    };
  }

  return {
    success: true,
    message: 'La conexión con la base de datos se ha establecido correctamente.',
  };
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
  } catch (error) {
    return {
      message: 'Error de base de datos: no se pudo crear el hospitalero.',
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
  } catch (error) {
    return {
      message: 'Error de base de datos: no se pudo actualizar el hospitalero.',
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
