import { defineEventHandler, getQuery, createError } from 'h3';
import { pool } from '../database/config';

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const upload_ke = query.upload_ke;

        if (!upload_ke) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Parameter upload_ke diperlukan!'
            });
        }

        const [details] = await pool.query(
            `SELECT d.* 
             FROM csv_upload_detail d
             JOIN csv_upload_header h ON d.header_id = h.id
             WHERE h.upload_ke = ?`,
            [upload_ke]
        );

        if (!details || details.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Data detail tidak ditemukan!'
            });
        }

        return details;
    } catch (error) {
        console.error('Error fetching details:', error);
        if (error.statusCode) {
            throw error;
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Gagal mengambil data detail!'
        });
    }
});