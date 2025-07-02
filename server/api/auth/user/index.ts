import { defineEventHandler, readBody, createError } from 'h3';
import { pool } from '../../../database/config';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const method = event.method;

  // GET - Fetch all users
  if (method === 'GET') {
    try {
      const [users] = await pool.query(
        "SELECT id, username, status FROM users"
      );
      return users;
    } catch (error) {
      console.error('Error Fetching Users: ', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch users!'
      });
    }
  }

  // POST - Create new user
  if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { username, password, role } = body;

      if (!username || !password || !role) {
        return {
          status: 400,
          message: 'Username, password, and role are required'
        };
      }

      const [existingUsers] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return {
          status: 400,
          message: 'Username already exists'
        };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const status = role === 'admin' ? 1 : 0;

      const [result] = await pool.execute(
        'INSERT INTO users (username, password, status) VALUES (?, ?, ?)',
        [username, hashedPassword, status]
      );

      return {
        status: 200,
        message: 'User created successfully',
        data: { username, role }
      };
    } catch (error) {
      console.error('Create user error:', error);
      return {
        status: 500,
        message: 'Internal server error'
      };
    }
  }

  // PUT - Update user
  if (method === 'PUT') {
    try {
      const body = await readBody(event);
      const { id, username, password, role } = body;

      if (!id || !username || !role) {
        return {
          status: 400,
          message: 'ID, username, and role are required'
        };
      }

      const status = role === 'admin' ? 1 : 0;
      
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await pool.execute(
          'UPDATE users SET username = ?, password = ?, status = ? WHERE id = ?',
          [username, hashedPassword, status, id]
        );
      } else {
        await pool.execute(
          'UPDATE users SET username = ?, status = ? WHERE id = ?',
          [username, status, id]
        );
      }

      return {
        status: 200,
        message: 'User updated successfully'
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        status: 500,
        message: 'Internal server error'
      };
    }
  }

  // DELETE - Delete user
  if (method === 'DELETE') {
    try {
      const body = await readBody(event);
      const { id } = body;

      if (!id) {
        return {
          status: 400,
          message: 'User ID is required'
        };
      }

      await pool.execute('DELETE FROM users WHERE id = ?', [id]);

      return {
        status: 200,
        message: 'User deleted successfully'
      };
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        status: 500,
        message: 'Internal server error'
      };
    }
  }
});