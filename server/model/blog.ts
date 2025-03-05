import {sql}  from '~~/server/db';

export type BlogModel = {
    t_id: number;
    t_invoice: string,
    u_name: string,
    t_date: string;
};

export const read = async () => {
    const result = await sql({
        query: 'SELECT t_id, t_invoice, u_name t_date FROM csv_transactions'
    });

    return result as BlogModel[];
};

export const create = async (data: Pick<BlogModel, 't_invoice' | 'u_name'>) => {
    const result = (await sql({
        query: `INSERT INTO csv_transactions(
        t_invoice,
        u_name
        ) VALUES (?, ?)`,
        values: [data.t_invoice, data.u_name]
    })) as any;
    return {t_invoice: data.t_invoice, u_name: data.u_name};
};

export const detail = async (t_id: string) => {
    const result = (await sql({
        query: 'SELECT t_id, t_invoice, u_name, t_date FROM csv_transactions WHERE t_id = ?',
        values: [t_id]
    })) as any;

    return result.length === 1 ? (result[0] as BlogModel) : null;
};

export const update = async (t_id: string, data: Pick<BlogModel, 't_invoice' | 'u_name'>) => {
    await sql({
        query: `UPDATE csv_transactions SET t_invoice = ?,
        u_name = ?
        WHERE t_id = ?`,
        values: [data.t_invoice, data.u_name, t_id]
    });

    return await detail(t_id);
};

export const remove = async (t_id: string) => {
    await sql({
        query: 'DELETE FROM csv_transactions WHERE t_id = ?',
        values: [t_id]
    });
    return true;
};