// server/controllers/clientController.js
const pool = require('../config/db')
const cloudinary = require('cloudinary').v2

// ---------- Cloudinary config ----------
// ⚠️ যদি uploadMiddleware.js-এ আগেই config করা থাকে,
// তাহলে নিচের block টি মুছে দিতে পারেন (দুইবার config করলে সমস্যা নেই)।
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ---------- Helper: Cloudinary public_id বের করা ----------
// Cloudinary URL: https://res.cloudinary.com/<cloud>/image/upload/v1234567/ananda_housing/clients/abc123.jpg
// public_id হবে: ananda_housing/clients/abc123
const extractPublicId = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return null

  try {
    const parts = url.split('/upload/')
    if (parts.length < 2) return null

    // parts[1] = "v1234567/ananda_housing/clients/abc123.jpg"
    let afterUpload = parts[1]

    // version part (v1234567/) বাদ দিন
    afterUpload = afterUpload.replace(/^v\d+\//, '')

    // extension বাদ দিন
    const publicId = afterUpload.replace(/\.[^/.]+$/, '')

    return publicId
  } catch (err) {
    console.error('extractPublicId error:', err)
    return null
  }
}

// ---------- Create Client ----------
exports.createClient = async (req, res) => {
  try {
    const {
      clientName,
      mobile,
      salesPersonName,
      plotNumber,
      projectName,
      visitDate,
      clientStatus,
    } = req.body

    if (
      !clientName ||
      !mobile ||
      !salesPersonName ||
      !plotNumber ||
      !projectName ||
      !visitDate ||
      !clientStatus
    ) {
      return res.status(400).json({ message: 'সব প্রয়োজনীয় field পূরণ করুন' })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Client photo দিন' })
    }

    // ✅ Cloudinary full URL: https://res.cloudinary.com/.../client_xxx.jpg
    const photoUrl = req.file.path

    const [result] = await pool.query(
      `INSERT INTO clients 
       (clientName, mobile, salesPersonName, plotNumber, projectName, visitDate, clientStatus, photoUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clientName,
        mobile,
        salesPersonName,
        plotNumber,
        projectName,
        visitDate,
        clientStatus,
        photoUrl,
      ]
    )

    res.status(201).json({
      message: '✅ Client সফলভাবে সংরক্ষণ হয়েছে',
      client: {
        id: result.insertId,
        clientName,
        mobile,
        salesPersonName,
        plotNumber,
        projectName,
        visitDate,
        clientStatus,
        photoUrl,
      },
    })
  } catch (err) {
    console.error('createClient error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ---------- Get Clients ----------
exports.getClients = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM clients ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch (err) {
    console.error('getClients error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ---------- Delete Client ----------
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params

    // 1️⃣ Client আছে কিনা চেক করুন
    const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [id])

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Client খুঁজে পাওয়া যায়নি।' })
    }

    const client = rows[0]

    // 2️⃣ Cloudinary থেকে photo delete করুন (যদি photoUrl থাকে)
    if (client.photoUrl) {
      const publicId = extractPublicId(client.photoUrl)

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId)
          console.log('✅ Cloudinary image deleted:', publicId)
        } catch (cloudErr) {
          // Photo delete fail হলেও client delete হবে
          console.error('Cloudinary delete failed:', cloudErr.message)
        }
      } else {
        console.warn('⚠️ public_id বের করা যায়নি:', client.photoUrl)
      }
    }

    // 3️⃣ Database থেকে client delete করুন
    await pool.query('DELETE FROM clients WHERE id = ?', [id])

    res.json({ message: '✅ Client সফলভাবে delete হয়েছে।' })
  } catch (err) {
    console.error('deleteClient error:', err)
    res.status(500).json({ message: 'Server error — client delete করা যায়নি।' })
  }
}