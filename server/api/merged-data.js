import mysql from 'mysql2';
import { pool } from '../database/config.js';
import { pool2 } from '../database/config2.js';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    console.log("Connecting to databases...");
    // Query data dari database pertama dengan urutan berdasarkan created_at DESC
    const [rows1] = await pool2.execute("SELECT request_id, created_at, base_amount, payment_status FROM file_upload_detail ORDER BY created_at DESC");
    console.log("Fetched rows from db1:", rows1);

    // Query data dari database kedua dengan urutan berdasarkan tanggal DESC
    const [rows2] = await pool.execute("SELECT t_id, tanggal, tarif, status, user, pembayaran, lokasi, kendaraan FROM csv_transactions ORDER BY tanggal DESC");
    console.log("Fetched rows from db2:", rows2);

    // Set untuk melacak t_id yang sudah dicocokkan
    const matchedTIds = new Set();

    // Merge data yang cocok
    const matchedData = rows1.map(row1 => {
      const match = rows2.find(row2 => row2.t_id === row1.request_id);
      if (match) {
        matchedTIds.add(match.t_id);
        return {
          request_id: row1.request_id,
          created_at: row1.created_at,
          base_amount: row1.base_amount,
          payment_status_file: row1.payment_status,
          t_id: match.t_id,
          tanggal: match.tanggal,
          tarif: match.tarif,
          status: match.status,
          user: match.user,
          pembayaran: match.pembayaran,
          lokasi: match.lokasi,
          kendaraan: match.kendaraan
        };
      }
      return null;
    }).filter(item => item !== null);

    // Data yang tidak cocok (t_id yang belum dicocokkan)
    const unmatchedData = rows2
      .filter(row2 => !matchedTIds.has(row2.t_id))
      .map(row2 => ({
        t_id: row2.t_id,
        tanggal: row2.tanggal,
        tarif: row2.tarif,
        status: row2.status,
        user: row2.user,
        pembayaran: row2.pembayaran,
        lokasi: row2.lokasi,
        kendaraan: row2.kendaraan
      }));

    // Return hasil merge dan data yang tidak cocok
    return {
      success: true,
      matchedData,
      unmatchedData
    };
  } catch (error) {
    console.error("Error Fetching Data: ", error);
    return { success: false, error: "Failed to Fetch Data" };
  }
});