import { defineEventHandler, createError } from 'h3';
import { pool } from '../database/config';

export default defineEventHandler(async () => {
    try {
        const [headers] = await pool.query(
            "SELECT id, upload_ke, upload_date FROM csv_upload_header ORDER BY upload_date DESC"
        );
        return headers;
    } catch (error) {
        console.error('Error fetching headers:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Gagal mengambil data header!'
        });
    }
});