import type { Hospitalero } from './definitions';
import mysql from 'mysql2/promise';
import { randomUUID } from 'crypto';

// --- Database Connection ---
// The database connection is now configured via environment variables.
// Create a .env.local file in the root of your project and add the following:
// DB_HOST=...
// DB_USER=...
// DB_PASSWORD=...
// DB_DATABASE=...
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool: mysql.Pool;
function getPool() {
    if (!pool) {
        // @ts-ignore
        pool = mysql.createPool(dbConfig);
    }
    return pool;
}

async function query(sql: string, params: any[]): Promise<any> {
    // If the host is not configured, don't try to connect.
    if (!dbConfig.host) {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            console.warn("Database is not configured. Returning empty results for read query.");
            return [];
        }
        // For writes, throw an error
        throw new Error('La base de datos no está configurada. Por favor, introduce tus credenciales en un fichero .env.local y reinicia el servidor.');
    }

    try {
        const pool = getPool();
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error("Database query failed:", error);
        // Re-throw the error so the action layer can catch it and report it to the user.
        throw new Error('No se pudo realizar la consulta a la base de datos. Comprueba que las credenciales en .env.local son correctas y que la base de datos es accesible.');
    }
}


export async function getHospitaleros(): Promise<Hospitalero[]> {
    const results = await query('SELECT id, nombre, apellido, direccion, telefono, disponibilidad, notas, avatar FROM hospitaleros ORDER BY nombre, apellido', []) as any[];
    return results;
}

export async function getHospitaleroById(id: string): Promise<Hospitalero | undefined> {
    const results = await query('SELECT * FROM hospitaleros WHERE id = ?', [id]) as any[];
    if (results.length === 0) {
        return undefined;
    }
    return results[0] as Hospitalero;
}

export async function addHospitalero(hospitalero: Omit<Hospitalero, 'id' | 'avatar'>): Promise<Hospitalero> {
  const newId = randomUUID();
  const newHospitalero: Hospitalero = {
    ...hospitalero,
    id: newId,
    avatar: `avatar${(Math.floor(Math.random() * 5)) + 1}`,
  };

  await query(
    'INSERT INTO hospitaleros (id, nombre, apellido, direccion, telefono, disponibilidad, notas, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      newHospitalero.id,
      newHospitalero.nombre,
      newHospitalero.apellido,
      newHospitalero.direccion,
      newHospitalero.telefono,
      newHospitalero.disponibilidad,
      newHospitalero.notas,
      newHospitalero.avatar
    ]
  );
  return newHospitalero;
}

export async function updateHospitalero(id: string, data: Partial<Omit<Hospitalero, 'id'>>): Promise<Hospitalero | null> {
    await query(
        'UPDATE hospitaleros SET nombre = ?, apellido = ?, direccion = ?, telefono = ?, disponibilidad = ?, notas = ? WHERE id = ?',
        [data.nombre, data.apellido, data.direccion, data.telefono, data.disponibilidad, data.notas, id]
    );

    const updatedHospitalero = await getHospitaleroById(id);
    return updatedHospitalero || null;
}

export async function deleteHospitalero(id: string): Promise<boolean> {
  const result: any = await query('DELETE FROM hospitaleros WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
