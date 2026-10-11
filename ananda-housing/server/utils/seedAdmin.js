const bcrypt = require('bcryptjs')
const pool = require('../config/db')
require('dotenv').config()

async function seedAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    const name = process.env.ADMIN_NAME || 'Super Admin'

    if (!email || !password) {
      console.log('⚠️  ADMIN_EMAIL বা ADMIN_PASSWORD .env-এ নেই — seed skip')
      return
    }

    const [rows] = await pool.query('SELECT id FROM admins WHERE email = ?', [email])

    if (rows.length > 0) {
      console.log('✅ Super Admin already exists:', email)
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await pool.query(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )
    console.log('🎉 Super Admin account তৈরি হয়েছে:', email)
  } catch (err) {
    console.error('❌ Seed Admin error:', err.message)
  }
}

module.exports = seedAdmin