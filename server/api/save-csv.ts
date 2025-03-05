import { defineEventHandler, readBody } from 'h3';
import { sql } from '~~/server/db';

function convertDateFormat(dateStr) {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('-');
    return `${year}-${month}-${day} ${timePart}`;
}

export default defineEventHandler(async (event) => {
    try {
        const data = await readBody(event);

        // Validasi: Pastikan data adalah array
        if (!Array.isArray(data)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Data harus berupa array!'
            });
        }

        // Simpan histori header
        const user = 'admin'; // Ganti dengan pengguna yang sesuai
        const recordCount = data.length;

        // Dapatkan nomor urut upload (upload_ke)
        const uploadKeResult = await sql({
            query: "SELECT MAX(upload_ke) AS max_upload_ke FROM csv_upload_header WHERE user = ?",
            values: [user]
        });
        const uploadKe = (uploadKeResult[0]?.max_upload_ke || 0) + 1;

        // Insert ke tabel csv_upload_header
        const headerInsertResult = await sql({
            query: "INSERT INTO csv_upload_header (upload_date, user, upload_ke, file_name) VALUES (?, ?, ?, ?)",
            values: [new Date(), user, uploadKe, 'uploaded_file.csv'] // Ganti 'uploaded_file.csv' dengan nama file jika ada
        });

        const headerId = headerInsertResult.insertId;

        // Loop melalui setiap baris data CSV
        for (const row of data) {
            // Validasi: Pastikan semua field ada dan tidak kosong
            if (!row.t_id || !row.tanggal || !row.user || !row.status || !row.tarif || !row.pembayaran || !row.lokasi || !row.kendaraan || !row.uji_emisi) {
                console.error('Data tidak valid:', row);
                continue; // Lewati baris yang tidak valid
            }

            // Konversi tarif ke number jika diperlukan
            const amountPay = parseFloat(row.tarif);
            if (isNaN(amountPay)) {
                console.error('Nilai tarif tidak valid:', row.tarif);
                continue; // Lewati baris dengan nilai tarif tidak valid
            }

            // Konversi format tanggal
            const formattedDate = convertDateFormat(row.tanggal);

            // Simpan data ke tabel csv_transactions
            await sql({
                query: "INSERT INTO csv_transactions (t_id, tanggal, user, status, tarif, pembayaran, lokasi, kendaraan, uji_emisi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                values: [
                    row.t_id,
                    formattedDate,
                    row.user,
                    row.status,
                    amountPay,
                    row.pembayaran,
                    row.lokasi,
                    row.kendaraan,
                    row.uji_emisi
                ]
            });

            // Simpan data ke tabel csv_upload_detail
            await sql({
                query: "INSERT INTO csv_upload_detail (header_id, t_id, tanggal, user, status, tarif, pembayaran, lokasi, kendaraan, uji_emisi, upload_date, upload_ke) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                values: [
                    headerId,
                    row.t_id,
                    formattedDate,
                    row.user,
                    row.status,
                    amountPay,
                    row.pembayaran,
                    row.lokasi,
                    row.kendaraan,
                    row.uji_emisi,
                    new Date(),
                    uploadKe
                ]
            });
        }

        return { message: "Data CSV berhasil disimpan ke database!" };
    } catch (error) {
        console.error('Error saat menyimpan data:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Gagal Menyimpan data!'
        });
    }
});