import { pool } from '../../database/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return {
        status: 400,
        message: 'Username and password are required'
      };
    }

    // Get user from database
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    const user = Array.isArray(users) && users.length > 0 ? users[0] : null;

    if (!user) {
      return {
        status: 401,
        message: 'Invalid username or password'
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return {
        status: 401,
        message: 'Invalid username or password'
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.status === 1 ? 'admin' : 'user' },
      process.env.JWT_SECRET_KEY, // Gunakan secret key dari environment variable
      { expiresIn: '1h' } // Token berlaku selama 1 jam
    );

    return {
      status: 200,
      message: 'Login successful',
      data: {
        username: user.username,
        role: user.status === 1 ? 'admin' : 'user',
        token: token // Kirim token ke klien
      }
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      status: 500,
      message: 'Internal server error'
    };
  }
});