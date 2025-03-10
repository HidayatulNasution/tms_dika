import pool from '../utils/db';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const query = `SELECT 
        t_date,
        u_name,
        t_status,
        t_amount_pay,
        pay_with,
        l_name,
        v_number,
        uji_emisi,
        v_name,
        t_booking_expired,
        t_officer_name,
        l_id,
        t_time_start,
        t_time_expired,
        t_time_stop,
	    t_time_total FROM "public"."transactions" WHERE "t_status" IN ('completed') ORDER BY "t_date" DESC LIMIT 20000`;
        const {rows} = await pool.query(query);
        return {success: true, data: rows};
    } catch (error) {
        return {success: false, error: error.message};
    }
});