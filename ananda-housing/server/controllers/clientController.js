// server/controllers/clientController.js
const pool = require('../config/db')
const cloudinary = require('cloudinary').v2

// ---------- Cloudinary config ----------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ---------- Helper: Cloudinary public_id বের করা ----------
const extractPublicId = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return null

  try {
    const parts = url.split('/upload/')
    if (parts.length < 2) return null

    let afterUpload = parts[1]
    afterUpload = afterUpload.replace(/^v\d+\//, '')
    const publicId = afterUpload.replace(/\.[^/.]+$/, '')

    return publicId
  } catch (err) {
    console.error('extractPublicId error:', err.message)
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
    // ✅ সঠিক error logging
    console.error('=== createClient error ===')
    console.error('Message:', err.message)
    console.error('Code:', err.code)
    console.error('SQL Message:', err.sqlMessage)
    console.error('Stack:', err.stack)

    res.status(500).json({
      message: 'Server error',
      detail: err.message,
      code: err.code || null,
      sqlMessage: err.sqlMessage || null,
    })
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
    console.error('=== getClients error ===')
    console.error('Message:', err.message)
    console.error('SQL Message:', err.sqlMessage)
    res.status(500).json({
      message: 'Server error',
      detail: err.message,
      sqlMessage: err.sqlMessage || null,
    })
  }
}

// ---------- Delete Client ----------
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [id])

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Client খুঁজে পাওয়া যায়নি।' })
    }

    const client = rows[0]

    if (client.photoUrl) {
      const publicId = extractPublicId(client.photoUrl)

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId)
          console.log('✅ Cloudinary image deleted:', publicId)
        } catch (cloudErr) {
          console.error('Cloudinary delete failed:', cloudErr.message)
        }
      } else {
        console.warn('⚠️ public_id বের করা যায়নি:', client.photoUrl)
      }
    }

    await pool.query('DELETE FROM clients WHERE id = ?', [id])

    res.json({ message: '✅ Client সফলভাবে delete হয়েছে।' })
  } catch (err) {
    console.error('=== deleteClient error ===')
    console.error('Message:', err.message)
    console.error('SQL Message:', err.sqlMessage)
    res.status(500).json({
      message: 'Server error — client delete করা যায়নি।',
      detail: err.message,
      sqlMessage: err.sqlMessage || null,
    })
  }
}