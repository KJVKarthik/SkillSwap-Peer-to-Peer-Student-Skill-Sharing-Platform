import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pool = null;
let isConnected = false;
let connectionError = null;

const dbConfig = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD !== undefined ? process.env.MYSQL_PASSWORD : '',
  database: process.env.MYSQL_DATABASE || 'skillswap',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export async function initMySQL() {
  if (pool) return pool;

  try {
    // First attempt to connect without database to create if not exists
    const rootConn = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConn.end();

    // Create pool with target database
    pool = mysql.createPool(dbConfig);
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();

    isConnected = true;
    connectionError = null;
    console.log(`✅ [MySQL] Successfully connected to MySQL database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);

    // Run schema migrations if schema.sql exists
    await runSchema();

    return pool;
  } catch (err) {
    isConnected = false;
    connectionError = err.message;
    console.warn(`ℹ️ [MySQL] MySQL connection not established (${err.message}). Defaulting to Persistent Local Demo Mode (db.json).`);
    return null;
  }
}

async function runSchema() {
  if (!pool) return;
  try {
    const schemaFile = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaFile)) {
      const sql = fs.readFileSync(schemaFile, 'utf-8');
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      const conn = await pool.getConnection();
      for (const stmt of statements) {
        try {
          await conn.query(stmt);
        } catch (e) {
          // ignore already existing or minor errors
        }
      }
      conn.release();
      console.log('✅ [MySQL] Database tables checked/migrated.');
    }
  } catch (err) {
    console.error('Error applying MySQL schema:', err.message);
  }
}

export function isMySQLActive() {
  return isConnected && pool !== null;
}

export function getMySQLPool() {
  return pool;
}

export function getMySQLError() {
  return connectionError;
}
