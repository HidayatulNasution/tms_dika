import {defineEventHandler} from 'h3';
import {sql} from '~~/server/db';

export default defineEventHandler(async () => {
    try {
        const merged = await sql({
            query: "SELECT SUM(base_amount) AS total_base_amount, SUM(tarif) AS total_tarif FROM merged_data"
        });
        return merged;
    } catch (error) {
        console.error('Error Fetching Merged Data:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Gagal mengambil data merged!'
        });
    }
})