import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DEV_DB_USERNAME,
    host: process.env.DEV_DB_HOST,
    database: process.env.DEV_DB_DATABASE,
    password: process.env.DEV_DB_PASSWORD,
    port: process.env.DEV_DB_PORT,
});

export default pool;