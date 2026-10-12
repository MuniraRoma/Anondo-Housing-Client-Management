const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const clientRoutes = require('./routes/clientRoutes')
const seedAdmin = require('./utils/seedAdmin')
const pool = require('./config/db')

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/clients', clientRoutes)

// Health check
app.get('/', (req, res) => res.json({ message: 'Anondo Housing API চালু আছে ✅' }))

const PORT = process.env.PORT || 5000

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Server চালু হয়েছে পোর্ট ${PORT}-এ`)
  try {
    await pool.query('SELECT 1')
    console.log('✅ MySQL connection সফল')
    await seedAdmin()
  } catch (err) {
    console.error('❌ Startup error:', err.message)
  }
})