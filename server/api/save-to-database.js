import { pool } from '../database/config.js'; // Pastikan path ini sesuai dengan struktur folder Anda
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event); // Baca data dari request body
    const data = Array.isArray(body) ? body : [];

    if (data.length === 0) {
      return { success: false, message: 'No data to save' };
    }

    // Query untuk menyimpan data ke tabel merged_data
    const insertQuery = `
      INSERT INTO merged_data (request_id, created_at, base_amount, payment_status_file, t_id, tanggal, tarif, status, user, pembayaran, lokasi, kendaraan)
      VALUES ?
    `;

    const values = data.map(item => [
      item.request_id,
      item.created_at,
      item.base_amount,
      item.payment_status_file,
      item.t_id,
      item.tanggal,
      item.tarif,
      item.status,
      item.user,
      item.pembayaran,
      item.lokasi,
      item.kendaraan
    ]);

    // Eksekusi query insert ke tabel merged_data
    await pool.query(insertQuery, [values]);

    // Hapus data dari tabel csv_transactions berdasarkan t_id
    const deleteQuery = "DELETE FROM csv_transactions WHERE t_id IN (?)";
    const tIds = data.map(item => item.t_id); // Ambil semua t_id dari data

    // Eksekusi query delete
    await pool.query(deleteQuery, [tIds]);

    return { success: true, message: 'Data saved and corresponding csv_transactions deleted successfully' };
  } catch (error) {
    console.error("Error saving or deleting data: ", error);
    return { success: false, message: 'Failed to save or delete data' };
  }
});