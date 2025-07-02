import { defineEventHandler, createError } from 'h3';
import { pool } from '../../../database/config';

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;

  try {
    const [users] = await pool.execute(
      'SELECT id, username, status FROM users WHERE id = ?',
      [id]
    );

    if (!users || users.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      });
    }

    return users[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user details'
    });
  }
});