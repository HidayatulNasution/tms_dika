import { defineEventHandler } from 'h3';
import formidable from 'formidable';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import { sql } from '~~/server/db';

export default defineEventHandler(async (event) => {
    const form = formidable({ uploadDir: '/tmp', keepExtensions: true });
    const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
            if (err) return reject(err);
            resolve([fields, files]);
        });
    });

    if (!files.file) {
        throw createError({ statusCode: 400, statusMessage: 'No file uploaded' });
    }

    const filePath = files.file[0].filepath;
    const fileName = files.file[0].originalFilename; // Nama file CSV
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    // Simpan histori upload
    const user = 'admin'; // Ganti dengan pengguna yang sesuai
    const recordCount = records.length;

    await sql({
        query: "INSERT INTO csv_upload_history (upload_date, file_name, record_count, user) VALUES (?, ?, ?, ?)",
        values: [new Date(), fileName, recordCount, user]
    });

    return { data: records };
});