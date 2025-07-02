import { defineEventHandler, createError } from 'h3';
import { pool } from '../../database/config';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { userId, capability } = query;

    if (!userId || !capability) {
      return {
        status: 400,
        message: 'User ID and capability are required',
        hasAccess: false
      };
    }

    // Check if user has the capability
    const [userCapabilities] = await pool.execute(
      'SELECT * FROM user_capabilities WHERE user_id = ? AND capability = ?',
      [userId, capability]
    );

    const hasAccess = Array.isArray(userCapabilities) && userCapabilities.length > 0;

    return {
      status: 200,
      hasAccess
    };
  } catch (error) {
    console.error('Check capability error:', error);
    return {
      status: 500,
      message: 'Internal server error',
      hasAccess: false
    };
  }
});