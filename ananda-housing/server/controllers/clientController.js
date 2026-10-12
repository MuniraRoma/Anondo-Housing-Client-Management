// server/controllers/clientController.js
const pool = require('../config/db')

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

exports.getClients = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    console.error('getClients error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}