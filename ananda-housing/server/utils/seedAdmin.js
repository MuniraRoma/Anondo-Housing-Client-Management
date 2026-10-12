const bcrypt = require('bcryptjs');
require('dotenv').config();

// ✅ FIX: db.js থেকে pool সরাসরি export করা হয়েছে, তাই { pool } নয়
const pool = require('../config/db');

async function seedAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL?.trim();
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || 'Super Admin';

    if (!email || !password) {
      console.log(
        '⚠️ ADMIN_EMAIL বা ADMIN_PASSWORD .env-এ নেই — seed skipped'
      );
      return;
    }

    // Verify that the admins table exists
    const [tables] = await pool.query(
      "SHOW TABLES LIKE 'admins'"
    );

    if (tables.length === 0) {
      console.error(
        '❌ Admin seed failed: admins table does not exist in database:',
        process.env.DB_NAME
      );
      return;
    }

    // Check whether the admin already exists
    const [rows] = await pool.query(
      'SELECT id FROM admins WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length > 0) {
      console.log('✅ Super Admin already exists:', email);
      return;
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    await pool.query(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    console.log('🎉 Super Admin account created:', email);
  } catch (err) {
    console.error('❌ Seed Admin error:', err.message);
  }
}

module.exports = seedAdmin;