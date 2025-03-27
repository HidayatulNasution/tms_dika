import { defineEventHandler, readBody, createError } from 'h3';
import { pool } from '../database/config.js';

function convertDateFormat(dateStr: string): string {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('-');
    return `${year}-${month}-${day} ${timePart}`;
}

export default defineEventHandler(async (event) => {
    console.log('Received request:', event.node.req.method, event.node.req.url);
    try {
        const data = await readBody(event);
        // Validasi bahwa data adalah array
        if (!Array.isArray(data)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Data harus berupa array!'
            });
        }

        // Simpan header history
        const user = 'admin'; // Ganti dengan pengguna yang sesuai
        const recordCount = data.length;

        // Dapatkan nomor urut upload
        const [uploadKeResult] = await pool.query(
            "SELECT MAX(upload_ke) AS max_upload_ke FROM csv_upload_header WHERE user = ?",
            [user]
        );
        const uploadKe = (uploadKeResult[0]?.max_upload_ke || 0) + 1;

        // Insert ke csv_upload_header
        const [headerInsertResult] = await pool.query(
            "INSERT INTO csv_upload_header (upload_date, user, upload_ke, file_name) VALUES (?, ?, ?, ?)",
            [new Date(), user, uploadKe, 'uploaded_file.csv']
        );
        const headerId = headerInsertResult.insertId;

        // Proses setiap baris CSV
        for (const row of data) {
            // Validasi field yang diperlukan
            if (!row.t_id || !row.user || !row.status || !row.tarif || !row.pembayaran || !row.lokasi || !row.kendaraan || !row.tanggal) {
                console.error('Data tidak valid:', row);
                continue;
            }

            // Konversi tarif ke angka
            const amountPay = parseFloat(row.tarif);
            if (isNaN(amountPay)) {
                console.error('Nilai tarif tidak valid:', row.tarif);
                continue;
            }

            // Konversi format tanggal
            const formattedDate = convertDateFormat(row.tanggal);

            // Simpan ke csv_transactions
            await pool.query(
                `INSERT INTO csv_transactions 
                 (t_id, user, status, tarif, pembayaran, lokasi, kendaraan, tanggal) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    row.t_id,
                    row.user,
                    row.status,
                    amountPay,
                    row.pembayaran,
                    row.lokasi,
                    row.kendaraan,
                    formattedDate
                ]
            );

            // Simpan ke csv_upload_detail
            await pool.query(
                `INSERT INTO csv_upload_detail 
                 (header_id, t_id, user, status, tarif, pembayaran, lokasi, kendaraan, tanggal) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    headerId,
                    row.t_id,
                    row.user,
                    row.status,
                    amountPay,
                    row.pembayaran,
                    row.lokasi,
                    row.kendaraan,
                    formattedDate
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