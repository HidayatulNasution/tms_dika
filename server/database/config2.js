import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

console.log('DB2_HOST:', process.env.DB2_HOST);
console.log('DB2_PORT:', process.env.DB2_PORT);
console.log('DB2_USER:', process.env.DB2_USER);
console.log
('DB2_PASSWORD:', process.env.DB2_PASSWORD);
console.log
('DB2_NAME:', process.env.DB2_NAME);

// Configurasi database
// Create the second connection pool
export const pool2 = mysql.createPool({
  host: process.env.DB2_HOST,
  port: Number(process.env.DB2_PORT),
  user: process.env.DB2_USER,
  password: process.env.DB2_PASSWORD,
  database: process.env.DB2_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});