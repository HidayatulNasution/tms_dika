import { pool } from '../../database/config';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username, password, role } = body;

    // Validate input
    if (!username || !password || !role) {
      return {
        status: 400,
        message: 'Username, password, and role are required'
      };
    }

    // Check if username already exists
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

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set status based on role
    const status = role === 'admin' ? 1 : 0;

    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO users (username, password, status) VALUES (?, ?, ?)',
      [username, hashedPassword, status]
    );

    return {
      status: 200,
      message: 'Registration successful',
      data: { username, role }
    };

  } catch (error) {
    console.error('Registration error:', error);
    return {
      status: 500,
      message: 'Internal server error'
    };
  }
});