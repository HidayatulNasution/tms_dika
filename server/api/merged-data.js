import mysql from 'mysql2';

const db1 = mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'dev-tkdn',
    password: 'Dev@123!@#',
    database: 'pcbs_core_db'
});

const db2 = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'jakparkir'
});

export default defineEventHandler(async (event) => {
    try {
        console.log("Connecting to databases...");
        // Query data dari database pertama dengan urutan berdasarkan created_at DESC
        const [rows1] = await db1.promise().query("SELECT request_id, created_at, base_amount, payment_status FROM file_upload_detail ORDER BY created_at DESC");
        console.log("Fetched rows from db1:", rows1);

        // Query data dari database kedua dengan urutan berdasarkan tanggal DESC
        const [rows2] = await db2.promise().query("SELECT t_id, tanggal, tarif, status, user, pembayaran, lokasi, kendaraan FROM csv_transactions ORDER BY tanggal DESC");
        console.log("Fetched rows from db2:", rows2);

        // Merge data dari kedua tabel
        const mergedData = rows1.map(row1 => {
            const match = rows2.find(row2 => row2.t_id === row1.request_id);
            return match ? {
                request_id: row1.request_id,
                created_at: row1.created_at,
                base_amount: row1.base_amount,
                payment_status_file: row1.payment_status,
                t_id: match.t_id,
                tanggal: match.tanggal,
                tarif: match.tarif,
                status: match.status,
                user: match.user,
                pembayaran: match.pembayaran,
                lokasi: match.lokasi,
                kendaraan: match.kendaraan
            } : null;
        }).filter(item => item !== null); // Hapus entri null

        // Return hasil merge
        return { success: true, data: mergedData };
    } catch (error) {
        console.error("Error Fetching Data: ", error);
        return { success: false, error: "Failed to Fetch Data" };
    }
});