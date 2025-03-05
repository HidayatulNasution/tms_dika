import mysql from 'mysql2/promise';

export default defineEventHandler(async (event) => {
  try {
    console.log("🚀 Connecting to database...");

    const connection = await mysql.createConnection({
      host: '127.0.0.1',  // Gunakan localhost karena sudah di-tunnel
      port: 3307,         // Sesuai dengan port yang di-forward
      user: 'dev-tkdn',
      password: 'Dev@123!@#',
      database: 'pcbs_core_db',
    });

    console.log("✅ Connected to database!");

    const [rows] = await connection.execute('SELECT request_id, created_at, base_amount, payment_status FROM pcbs_core_db.file_upload_detail WHERE payment_status LIKE ? ORDER BY created_at DESC',
        ['%SUCCESS%']
    );
    await connection.end();

    console.log("📊 Data retrieved:", rows.length, "rows");

    return rows;
  } catch (error) {
    console.error("❌ Error:", error.message);
    return { error: error.message };
  }
});
