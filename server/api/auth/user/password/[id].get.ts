import { defineEventHandler, createError } from 'h3';
import { pool } from '../../../../database/config';

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;

  try {
    const [users] = await pool.execute(
      'SELECT password FROM users WHERE id = ?',
      [id]
    );

    if (!users || users.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      });
    }

    return { password: users[0].password };
  } catch (error) {
    console.error('Error fetching user password:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user password'
    });
  }
});