import mysql from 'mysql2/promise';
import fs from 'fs';

// ❗️Buat file baru bernama env-parser.js di folder yang sama
// env-parser.js
export const envToJson = (() => {
  try {
    const envFile = fs.readFileSync('.env', 'utf8');
    return envFile
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .reduce((acc, line) => {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        acc[key.trim()] = value.replace(/^['"]|['"]$/g, '');
        return acc;
      }, {});
  } catch (error) {
    console.error('Gagal membaca .env:', error.message);
    return {};
  }
})();

// Configurasi database
const dbConfig = {
  host: envToJson.DB2_HOST,
  port: parseInt(envToJson.DB2_PORT),
  user: envToJson.DB2_USER,
  password: envToJson.DB2_PASSWORD,
  database: envToJson.DB2_NAME
};

// Tambahkan log untuk verifikasi
console.log('Konfigurasi Database:');
console.log('Host:', dbConfig.host);
console.log('Port:', dbConfig.port);
console.log('User:', dbConfig.user);
console.log('Password:', dbConfig.password ? '******' : 'KOSONG');
console.log('Database:', dbConfig.database);

export const pool2 = mysql.createPool(dbConfig);