import type { Hospitalero, User } from './definitions';
import { UserSchema } from './definitions';
import mysql, { type Pool } from 'mysql2/promise';
import { randomUUID } from 'crypto';
import type { z } from 'zod';


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

// This global variable is used to cache the connection pool.
// This is important to avoid exhausting database connections in a serverless environment or during development with hot-reloading.
declare global {
  // We use `var` here because `let` and `const` have block scope.
  // eslint-disable-next-line no-var
  var mysqlPool: Pool | undefined;
}

function getPool(): Pool {
  if (global.mysqlPool) {
      return global.mysqlPool;
  }
  // The type assertion is to handle the case where process.env variables might be undefined.
  // The query function already checks if the host is configured.
  global.mysqlPool = mysql.createPool(dbConfig as mysql.PoolOptions);
  return global.mysqlPool;
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
    } catch (error: any) {
        console.error("Database query failed:", error);
        // Re-throw the error so the action layer can catch it and report it to the user.
        throw new Error(`No se pudo realizar la consulta a la base de datos. Comprueba que las credenciales en .env.local son correctas y que la base de datos es accesible. Error: ${error.message}`);
    }
}


export async function getHospitaleros(): Promise<Hospitalero[]> {
    if (!dbConfig.host) return [];
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


// --- User Functions ---

export async function getUsers(): Promise<User[]> {
    if (!dbConfig.host) return [];
    const results = await query('SELECT id, username, can_add, can_edit, can_delete FROM users ORDER BY username', []) as any[];
    return results.map(user => ({...user, can_add: !!user.can_add, can_edit: !!user.can_edit, can_delete: !!user.can_delete}));
}

export async function getUserById(id: string): Promise<User | undefined> {
    const results = await query('SELECT id, username, can_add, can_edit, can_delete FROM users WHERE id = ?', [id]) as any[];
    if (results.length === 0) return undefined;
    const user = results[0];
    return {...user, can_add: !!user.can_add, can_edit: !!user.can_edit, can_delete: !!user.can_delete};
}

export async function getUserByUsername(username: string) {
    const results = await query('SELECT * FROM users WHERE username = ?', [username]) as any[];
    if (results.length === 0) return undefined;
    return results[0]; // returns full user object with password
}

export async function addUser(user: z.infer<typeof UserSchema>): Promise<User> {
    const newId = randomUUID();
    // For production, you should hash the password here.
    await query(
        'INSERT INTO users (id, username, password, can_add, can_edit, can_delete) VALUES (?, ?, ?, ?, ?, ?)',
        [newId, user.username, user.password, user.can_add, user.can_edit, user.can_delete]
    );
    return { id: newId, username: user.username, can_add: !!user.can_add, can_edit: !!user.can_edit, can_delete: !!user.can_delete };
}

export async function updateUser(id: string, data: Partial<z.infer<typeof UserSchema>>): Promise<User | null> {
    if (data.password) {
        // For production, you should hash the password here.
        await query(
            'UPDATE users SET username = ?, password = ?, can_add = ?, can_edit = ?, can_delete = ? WHERE id = ?',
            [data.username, data.password, data.can_add, data.can_edit, data.can_delete, id]
        );
    } else {
        await query(
            'UPDATE users SET username = ?, can_add = ?, can_edit = ?, can_delete = ? WHERE id = ?',
            [data.username, data.can_add, data.can_edit, data.can_delete, id]
        );
    }
    
    return await getUserById(id) || null;
}

export async function deleteUser(id: string): Promise<boolean> {
  const result: any = await query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
