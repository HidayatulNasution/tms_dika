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

// ❗️Buat file baru bernama env-parser.js di folder yang sama
// env-parser.js
// export const envToJson = (() => {
//   try {
//     const envFile = path.resolve('.env', 'utf8');
//     return envFile
//       .split('\n')
//       .filter(line => line.trim() && !line.startsWith('#'))
//       .reduce((acc, line) => {
//         const [key, ...valueParts] = line.split('=');
//         const value = valueParts.join('=').trim();
//         acc[key.trim()] = value.replace(/^['"]|['"]$/g, '');
//         return acc;
//       }, {});
//   } catch (error) {
//     console.error('Gagal membaca .env:', error.message);
//     return {};
//   }
// })();

// Configurasi database
const dbConfig = {
  host: process.env.DB2_HOST,
  port: process.env.DB2_PORT,
  user: process.env.DB2_USER,
  password: process.env.DB2_PASSWORD,
  database: process.env.DB2_NAME
};

// Tambahkan log untuk verifikasi
console.log('Konfigurasi Database:');
console.log('Host:', dbConfig.host);
console.log('Port:', dbConfig.port);
console.log('User:', dbConfig.user);
console.log('Password:', dbConfig.password ? '******' : 'KOSONG');
console.log('Database:', dbConfig.database);

export const pool2 = mysql.createPool(dbConfig);