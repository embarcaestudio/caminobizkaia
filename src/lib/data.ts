import type { Hospitalero } from './definitions';
import mysql from 'mysql2/promise';
import { randomUUID } from 'crypto';

// --- Database Connection ---
// This is a placeholder for your database connection logic.
// After you save your configuration, you should replace these
// hardcoded values with a secure way to load your credentials,
// for example, using environment variables.
const dbConfig = {
    host: 'YOUR_DATABASE_HOST', // e.g., 'sql123.cdmon.com'
    user: 'YOUR_DATABASE_USER', // e.g., 'usuario_db'
    password: 'YOUR_DATABASE_PASSWORD',
    database: 'YOUR_DATABASE_NAME', // e.g., 'mi_base_de_datos'
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool: mysql.Pool;
function getPool() {
    if (!pool) {
        pool = mysql.createPool(dbConfig);
    }
    return pool;
}

async function query(sql: string, params: any[]): Promise<any> {
    // If the host is the placeholder, don't try to connect.
    if (dbConfig.host === 'YOUR_DATABASE_HOST') {
        console.warn("Database is not configured. Returning empty results.");
        return [];
    }

    try {
        const pool = getPool();
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error("Database query failed:", error);
        // For the app to not crash, return empty array on any query failure.
        // This allows the app to continue running even if the DB connection is lost.
        return [];
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
