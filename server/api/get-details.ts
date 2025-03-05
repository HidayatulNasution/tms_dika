import { defineEventHandler } from 'h3';
import { sql } from '~~/server/db';

export default defineEventHandler(async (event) => {
    try {
        const { upload_ke } = getQuery(event);

        if (!upload_ke) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Parameter upload_ke diperlukan!'
            });
        }

        const details = await sql({
            query: "SELECT * FROM csv_upload_detail WHERE upload_ke = ?",
            values: [upload_ke]
        });

        return details;
    } catch (error) {
        console.error('Error fetching details:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Gagal mengambil data detail!'
        });
    }
});