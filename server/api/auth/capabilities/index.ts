import { defineEventHandler, readBody, createError } from 'h3';
import { pool } from '../../../database/config';

export default defineEventHandler(async (event) => {
  const method = event.method;

  // GET - Fetch all capabilities
  if (method === 'GET') {
    try {
      const [capabilities] = await pool.query(
        "SELECT id, capability FROM capabilities"
      );
      return capabilities;
    } catch (error) {
      console.error('Error Fetching Capabilities: ', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch capabilities!'
      });
    }
  }

  // POST - Create new capability
  if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { capability } = body;

      if (!capability) {
        return {
          status: 400,
          message: 'Capability name is required'
        };
      }

      const [existingCapabilities] = await pool.execute(
        'SELECT * FROM capabilities WHERE capability = ?',
        [capability]
      );

      if (Array.isArray(existingCapabilities) && existingCapabilities.length > 0) {
        return {
          status: 400,
          message: 'Capability already exists'
        };
      }

      const [result] = await pool.execute(
        'INSERT INTO capabilities (capability) VALUES (?)',
        [capability]
      );

      return {
        status: 200,
        message: 'Capability created successfully',
        data: { capability }
      };
    } catch (error) {
      console.error('Create capability error:', error);
      return {
        status: 500,
        message: 'Internal server error'
      };
    }
  }

  // DELETE - Delete capability
  if (method === 'DELETE') {
    try {
      const body = await readBody(event);
      const { id } = body;

      if (!id) {
        return {
          status: 400,
          message: 'Capability ID is required'
        };
      }

      await pool.execute('DELETE FROM capabilities WHERE id = ?', [id]);

      return {
        status: 200,
        message: 'Capability deleted successfully'
      };
    } catch (error) {
      console.error('Delete capability error:', error);
      return {
        status: 500,
        message: 'Internal server error'
      };
    }
  }
});