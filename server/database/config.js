import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    development: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
};

const env = process.env.NODE_ENV || 'development';
const dbConfig =  config[env];

export const pool = mysql.createPool(dbConfig);