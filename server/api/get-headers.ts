import { defineEventHandler } from 'h3';
import { sql } from '~~/server/db';

export default defineEventHandler(async () => {
    try {
        const headers = await sql({
            query: "SELECT * FROM csv_upload_header ORDER BY upload_date DESC"
        });
        return headers;
    } catch (error) {
        console.error('Error fetching headers:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Gagal mengambil data header!'
        });
    }
});