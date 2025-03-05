import {defineEventHandler} from 'h3';
import {sql} from '~~/server/db';

export default defineEventHandler(async () => {
    try {
        const merged = await sql({
            query: "SELECT request_id, created_at, base_amount, payment_status_file, t_id, tanggal, tarif, status, user, pembayaran, lokasi, kendaraan FROM merged_data ORDER BY tanggal DESC"
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