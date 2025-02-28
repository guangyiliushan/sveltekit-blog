import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);

// import { DATABASE_URL } from '$env/static/private';

// if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

// const client = postgres(DATABASE_URL);