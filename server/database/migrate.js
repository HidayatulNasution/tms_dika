import { pool } from './config.js';

async function migrate() {
  try {
    const connection = await pool.getConnection();

    // Create tables
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS csv_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        t_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 't_id tidak boleh kosong',
        tanggal VARCHAR(255) NOT NULL DEFAULT 'tanggal tidak boleh kosong',
        user VARCHAR(255) NOT NULL DEFAULT 'user tidak boleh kosong',
        status VARCHAR(255) NOT NULL DEFAULT 'status tidak boleh kosong',
        tarif VARCHAR(255) NOT NULL DEFAULT 'tarif tidak boleh kosong',
        pembayaran VARCHAR(255) NOT NULL DEFAULT 'pembayaran tidak boleh kosong',
        lokasi VARCHAR(255) NOT NULL DEFAULT 'lokasi tidak boleh kosong',
        kendaraan VARCHAR(255) NOT NULL DEFAULT 'kendaraan tidak boleh kosong',
        uji_emisi VARCHAR(255) NOT NULL DEFAULT 'uji emisi tidak boleh kosong',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL DEFAULT 'user',
      password VARCHAR(255) NOT NULL DEFAULT 'password',
      status BOOLEAN DEFAULT FALSE
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS csv_upload_header (
        id INT AUTO_INCREMENT PRIMARY KEY,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user VARCHAR(255) NOT NULL DEFAULT 'user tidak boleh kosong',
        upload_ke INT NOT NULL,
        file_name VARCHAR(255) NOT NULL DEFAULT 'file_name tidak boleh kosong',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS csv_upload_detail (
        id INT AUTO_INCREMENT PRIMARY KEY,
        header_id INT NOT NULL,
        t_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 't_id tidak boleh kosong',
        tanggal VARCHAR(255) NOT NULL DEFAULT 'tanggal tidak boleh kosong',
        user VARCHAR(255) NOT NULL DEFAULT 'user tidak boleh kosong',
        status VARCHAR(255) NOT NULL DEFAULT 'status tidak boleh kosong',
        tarif VARCHAR(255) NOT NULL DEFAULT 'tarif tidak boleh kosong',
        pembayaran VARCHAR(255) NOT NULL DEFAULT 'pembayaran tidak boleh kosong',
        lokasi VARCHAR(255) NOT NULL DEFAULT 'lokasi tidak boleh kosong',
        kendaraan VARCHAR(255) NOT NULL DEFAULT 'kendaraan tidak boleh kosong',
        uji_emisi VARCHAR(255) NOT NULL DEFAULT 'uji emisi tidak boleh kosong',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX header_id (header_id ASC),
        CONSTRAINT csv_upload_detail_ibfk_1 FOREIGN KEY (header_id) 
          REFERENCES csv_upload_header (id) 
          ON DELETE RESTRICT 
          ON UPDATE RESTRICT
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS merged_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        request_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'request_id tidak boleh kosong',
        created_at VARCHAR(255) NOT NULL DEFAULT 'created_at tidak boleh kosong',
        base_amount VARCHAR(255) NOT NULL DEFAULT 'base_amount tidak boleh kosong',
        payment_status_file VARCHAR(255) NOT NULL DEFAULT 'payment_status_file tidak boleh kosong',
        t_id VARCHAR(255) NOT NULL DEFAULT 't_id tidak boleh kosong',
        tanggal VARCHAR(255) NOT NULL DEFAULT 'tanggal tidak boleh kosong',
        tarif VARCHAR(255) NOT NULL DEFAULT 'tarif tidak boleh kosong',
        status VARCHAR(255) NOT NULL DEFAULT 'status tidak boleh kosong',
        user VARCHAR(255) NOT NULL DEFAULT 'user tidak boleh kosong',
        pembayaran VARCHAR(255) NOT NULL DEFAULT 'pembayaran tidak boleh kosong',
        lokasi VARCHAR(255) NOT NULL DEFAULT 'lokasi tidak boleh kosong',
        kendaraan VARCHAR(255) NOT NULL DEFAULT 'kendaraan tidak boleh kosong'
      )
    `);

    console.log('Migration completed successfully');
    await connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Migration Failed:', error);
    process.exit(1);
  }
}

migrate();