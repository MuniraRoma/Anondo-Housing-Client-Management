const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')
require('dotenv').config()

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email এবং password দিন' })
    }

    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email])

    if (rows.length === 0) {
      return res.status(401).json({ message: 'ভুল email বা password' })
    }

    const admin = rows[0]
    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'ভুল email বা password' })
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      message: 'Login সফল',
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ================= CHANGE PASSWORD =================
// Admin Login করা অবস্থায় নিজের password পরিবর্তন করতে পারবে
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body
    const adminId = req.admin.id // authMiddleware থেকে আসে

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'সব field পূরণ করুন' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'নতুন password দুটি মিলছে না' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password কমপক্ষে ৬ character হতে হবে' })
    }

    const [rows] = await pool.query('SELECT * FROM admins WHERE id = ?', [adminId])

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin পাওয়া যায়নি' })
    }

    const admin = rows[0]
    const isMatch = await bcrypt.compare(oldPassword, admin.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'পুরনো password ভুল' })
    }

    const hashedNew = await bcrypt.hash(newPassword, 10)
    await pool.query('UPDATE admins SET password = ? WHERE id = ?', [hashedNew, adminId])

    res.json({ message: '✅ Password সফলভাবে পরিবর্তন হয়েছে' })
  } catch (err) {
    console.error('changePassword error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ================= CHANGE EMAIL =================
// Admin Login করা অবস্থায় নিজের email পরিবর্তন করতে পারবে
exports.changeEmail = async (req, res) => {
  try {
    const { oldEmail, password, newEmail, confirmEmail } = req.body
    const adminId = req.admin.id

    // ১. সব field আছে কিনা
    if (!oldEmail || !password || !newEmail || !confirmEmail) {
      return res.status(400).json({ message: 'সব field পূরণ করুন' })
    }

    // ২. নতুন email দুটি মিলছে কিনা
    if (newEmail !== confirmEmail) {
      return res.status(400).json({ message: 'নতুন email দুটি মিলছে না' })
    }

    // ৩. Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ message: 'সঠিক email format দিন' })
    }

    // ৪. নতুন email পুরনোর সমান নয়
    if (oldEmail === newEmail) {
      return res.status(400).json({ message: 'নতুন email পুরনোর সমান হতে পারে না' })
    }

    // ৫. Admin খুঁজুন
    const [rows] = await pool.query('SELECT * FROM admins WHERE id = ?', [adminId])

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin পাওয়া যায়নি' })
    }

    const admin = rows[0]

    // ৬. পুরনো email verify
    if (admin.email !== oldEmail) {
      return res.status(401).json({ message: 'পুরনো email ভুল' })
    }

    // ৭. Password verify
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Password ভুল' })
    }

    // ৮. নতুন email আগেই ব্যবহৃত হয়েছে কিনা
    const [existing] = await pool.query('SELECT id FROM admins WHERE email = ?', [newEmail])
    if (existing.length > 0) {
      return res.status(409).json({ message: 'এই email আগেই ব্যবহৃত হয়েছে' })
    }

    // ৯. Email update
    await pool.query('UPDATE admins SET email = ? WHERE id = ?', [newEmail, adminId])

    // ১০. নতুন JWT token তৈরি (কারণ email token-এ ছিল)
    const newToken = jwt.sign(
      { id: admin.id, email: newEmail },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      message: '✅ Email সফলভাবে পরিবর্তন হয়েছে',
      token: newToken,
      admin: { id: admin.id, name: admin.name, email: newEmail },
    })
  } catch (err) {
    console.error('changeEmail error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ================= FORGOT PASSWORD (Verify Old Credentials) =================
// Admin নিজের email + পুরনো password দিয়ে নতুন password সেট করতে পারবে
exports.forgotPassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body

    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'সব field পূরণ করুন' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'নতুন password দুটি মিলছে না' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password কমপক্ষে ৬ character হতে হবে' })
    }

    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email])

    if (rows.length === 0) {
      return res.status(404).json({ message: 'এই email-এ কোনো admin নেই' })
    }

    const admin = rows[0]
    const isMatch = await bcrypt.compare(oldPassword, admin.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'পুরনো password ভুল' })
    }

    const hashedNew = await bcrypt.hash(newPassword, 10)
    await pool.query('UPDATE admins SET password = ? WHERE id = ?', [hashedNew, admin.id])

    res.json({ message: '✅ Password সফলভাবে রিসেট হয়েছে। এখন নতুন password দিয়ে login করুন।' })
  } catch (err) {
    console.error('forgotPassword error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}