import { defineEventHandler, readBody, createError } from 'h3';
import { pool } from '../../../database/config';

export default defineEventHandler(async (event) => {
  const method = event.method;

  // GET - Fetch all user capabilities
  if (method === 'GET') {
    try {
      const query = getQuery(event);
      const userId = query.userId;

      if (!userId) {
        return [];
      }

      const [userCapabilities] = await pool.execute(
        `SELECT uc.id, uc.user_id, uc.capability, c.capability as capability_name 
         FROM user_capabilities uc 
         JOIN capabilities c ON uc.capability = c.capability 
         WHERE uc.user_id = ?`,
        [userId]
      );

      return userCapabilities;
    } catch (error) {
      // log untuk error
      console.error('Error Fetching User Capabilities: ', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch user capabilities!'
      });
    }
  }

  // POST - Assign capability to user
  if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { userId, capability } = body;

      if (!userId || !capability) {
        return {
          status: 400,
          message: 'User ID and capability are required'
        };
      }

      // Check if the assignment already exists
      const [existingAssignments] = await pool.execute(
        'SELECT * FROM user_capabilities WHERE user_id = ? AND capability = ?',
        [userId, capability]
      );

      if (Array.isArray(existingAssignments) && existingAssignments.length > 0) {
        return {
          status: 400,
          message: 'This capability is already assigned to the user'
        };
      }

      await pool.execute(
        'INSERT INTO user_capabilities (user_id, capability) VALUES (?, ?)',
        [userId, capability]
      );

      return {
        status: 200,
        message: 'Capability assigned successfully'
      };
    } catch (error) {
      console.error('Assign capability error:', error);
      return {
        status: 500,
        message: 'Internal server error'
      };
    }
  }

  // DELETE - Remove capability from user
  if (method === 'DELETE') {
    try {
      const body = await readBody(event);
      const { id } = body;

      if (!id) {
        return {
          status: 400,
          message: 'Assignment ID is required'
        };
      }

      await pool.execute('DELETE FROM user_capabilities WHERE id = ?', [id]);

      return {
        status: 200,
        message: 'Capability assignment removed successfully'
      };
    } catch (error) {
      console.error('Remove capability assignment error:', error);
      return {
        status: 500,
        message: 'Internal server error'
      };
    }
  }
});