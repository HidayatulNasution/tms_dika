import { defineEventHandler, createError } from 'h3';
import { pool } from '../database/config';

export default defineEventHandler(async (event) => {
  try {
    const [rows] = await pool.query(
      "SELECT SUM(base_amount) AS total_base_amount, SUM(tarif) AS total_tarif FROM merged_data"
    );
    return rows;
  } catch (error) {
    console.error('Error Fetching Merged Data:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mengambil data merged!'
    });
  }
});