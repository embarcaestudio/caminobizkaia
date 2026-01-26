import type { Hospitalero } from './definitions';

let hospitaleros: Hospitalero[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    direccion: 'Calle Falsa 123, Bilbao',
    telefono: '+34 611 223 344',
    disponibilidad: 'verano',
    notas: 'Experto en primeros auxilios.',
    avatar: 'avatar1',
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'García',
    direccion: 'Avenida Siempre Viva 742, Getxo',
    telefono: '+34 655 887 766',
    disponibilidad: 'fines-de-semana',
    notas: 'Habla inglés y francés.',
    avatar: 'avatar2',
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellido: 'López',
    direccion: 'Plaza Mayor 1, Portugalete',
    telefono: '+34 699 887 711',
    disponibilidad: 'todo-el-ano',
    notas: '',
    avatar: 'avatar3',
  },
  {
    id: '4',
    nombre: 'Ana',
    apellido: 'Martínez',
    direccion: 'Camino de Santiago 5, Leioa',
    telefono: '+34 633 445 566',
    disponibilidad: 'invierno',
    notas: 'Conoce bien las rutas alternativas.',
    avatar: 'avatar4',
  },
];

// Simulate a database delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getHospitaleros(): Promise<Hospitalero[]> {
  await delay(500);
  return [...hospitaleros];
}

export async function getHospitaleroById(id: string): Promise<Hospitalero | undefined> {
  await delay(200);
  return hospitaleros.find(h => h.id === id);
}

export async function addHospitalero(hospitalero: Omit<Hospitalero, 'id' | 'avatar'>): Promise<Hospitalero> {
  await delay(300);
  const newHospitalero: Hospitalero = {
    ...hospitalero,
    id: String(Date.now()),
    avatar: `avatar${(hospitaleros.length % 5) + 1}`,
  };
  hospitaleros.unshift(newHospitalero);
  return newHospitalero;
}

export async function updateHospitalero(id: string, data: Partial<Omit<Hospitalero, 'id'>>): Promise<Hospitalero | null> {
  await delay(300);
  const index = hospitaleros.findIndex(h => h.id === id);
  if (index !== -1) {
    hospitaleros[index] = { ...hospitaleros[index], ...data };
    return hospitaleros[index];
  }
  return null;
}

export async function deleteHospitalero(id: string): Promise<boolean> {
  await delay(400);
  const initialLength = hospitaleros.length;
  hospitaleros = hospitaleros.filter(h => h.id !== id);
  return hospitaleros.length < initialLength;
}
