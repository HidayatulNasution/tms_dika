import { defineEventHandler, readBody, createError } from 'h3';
import { pool } from '../database/config.js';

function convertDateFormat(dateStr: string) {
  const [datePart, timePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('-');
  return `${year}-${month}-${day} ${timePart}`;
}

export default defineEventHandler(async (event) => {
  console.log('Received request:', event.node.req.method, event.node.req.url);
  try {
    const data = await readBody(event);

    // Validate that data is an array
    if (!Array.isArray(data)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Data harus berupa array!'
      });
    }

    // Save header history
    const user = 'admin'; // Replace with appropriate user
    const recordCount = data.length;

    // Get upload sequence number
    const [uploadKeResult] = await pool.query(
      "SELECT MAX(upload_ke) AS max_upload_ke FROM csv_upload_header WHERE user = ?",
      [user]
    );

    const uploadKe = (uploadKeResult[0]?.max_upload_ke || 0) + 1;

    // Insert into csv_upload_header
    const [headerInsertResult] = await pool.query(
      "INSERT INTO csv_upload_header (upload_date, user, upload_ke, file_name) VALUES (?, ?, ?, ?)",
      [new Date(), user, uploadKe, 'uploaded_file.csv']
    );

    const headerId = headerInsertResult.insertId;

    // Process each CSV row
    for (const row of data) {
      // Validate required fields
      if (!row.t_id || !row.tanggal || !row.user || !row.status || 
          !row.tarif || !row.pembayaran || !row.lokasi || 
          !row.kendaraan || !row.uji_emisi) {
        console.error('Data tidak valid:', row);
        continue;
      }

      // Convert tarif to number
      const amountPay = parseFloat(row.tarif);
      if (isNaN(amountPay)) {
        console.error('Nilai tarif tidak valid:', row.tarif);
        continue;
      }

      // Convert date format
      const formattedDate = convertDateFormat(row.tanggal);

      // Save to csv_transactions
      await pool.query(
        `INSERT INTO csv_transactions 
         (t_id, tanggal, user, status, tarif, pembayaran, lokasi, kendaraan, uji_emisi) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          row.t_id,
          formattedDate,
          row.user,
          row.status,
          amountPay,
          row.pembayaran,
          row.lokasi,
          row.kendaraan,
          row.uji_emisi
        ]
      );

      // Save to csv_upload_detail
      await pool.query(
        `INSERT INTO csv_upload_detail 
         (header_id, t_id, tanggal, user, status, tarif, pembayaran, lokasi, kendaraan, uji_emisi) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          headerId,
          row.t_id,
          formattedDate,
          row.user,
          row.status,
          amountPay,
          row.pembayaran,
          row.lokasi,
          row.kendaraan,
          row.uji_emisi
        ]
      );
    }

    return { 
      success: true,
      message: "Data CSV berhasil disimpan ke database!",
      recordCount,
      uploadKe
    };
  } catch (error) {
    console.error('Error saat menyimpan data:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal menyimpan data!'
    });
  }
});