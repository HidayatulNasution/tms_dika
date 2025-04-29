// Import koneksi pool dari config2.js
import { pool2 } from "../database/config2";
import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    console.log("🚀 Connecting to database...");
    
    // Get query parameters
    const query = getQuery(event);
    const startDate = query.startDate;
    const endDate = query.endDate;
    const location = query.location;
    const payment = query.payment;

    // Validate dates
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    let params = ['%SUCCESS%', startDate, endDate];
    let additionalWhere = '';

    // Add location filter if provided
    if (location) {
      additionalWhere += ' AND d.name = ?';
      params.push(location);
    }

    // Add payment filter if provided
    if (payment) {
      additionalWhere += ' AND bg.name = ?';
      params.push(payment);
    }

    // Query gabungan untuk mendapatkan data dari ketiga tabel
    const [rows] = await pool2.execute(
      `SELECT 
          f.request_id, 
          f.created_at, 
          f.base_amount, 
          f.payment_status, 
          f.mid, 
          f.tid, 
          f.username, 
          f.batch_group_id,
          m.merchant_id, 
          d.name as merchant_name,
          bg.name as batch_group_name,
          fu.status as upload_status
       FROM 
          file_upload_detail f
       JOIN 
          merchant_batch_group m ON f.mid = m.mid
       JOIN 
          merchant_detail d ON m.merchant_id = d.merchant_id
        LEFT JOIN
          batch_group bg ON f.batch_group_id = bg.id
        LEFT JOIN
         file_upload fu ON f.file_upload_id = fu.id 
       WHERE 
          f.payment_status LIKE ?
          AND DATE(f.created_at) >= '2024-01-01'
          AND DATE(f.created_at) BETWEEN ? AND ?
          ${additionalWhere}
       ORDER BY 
          f.modified_at DESC
       `,
      params
    );

    console.log("📊 Data retrieved:", rows.length, "rows");
    return rows;
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw createError({
      statusCode: 400,
      message: error.message
    });
  }
});