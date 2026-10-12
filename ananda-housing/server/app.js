const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const clientRoutes = require('./routes/clientRoutes')
const seedAdmin = require('./utils/seedAdmin')
const pool = require('./config/db')

const app = express()

// ---------- CORS ----------
// Frontend (Netlify) থেকে image fetch/download করার জন্য
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://anondo-housing.netlify.app', // আপনার Netlify URL এখানে দিন
  // প্রয়োজনে আরও origin যোগ করুন
]

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / server-to-server request-এ origin থাকে না
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      // চাইলে সব allow করতে পারেন (development-এর জন্য সুবিধাজনক)
      return callback(null, true)
    },
    credentials: true,
  })
)

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// ---------- Static uploads ----------
const uploadsDir = path.join(__dirname, 'uploads')

// uploads folder না থাকলে তৈরি করুন (Render-এ প্রথম deploy-এ কাজে দেবে)
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('📁 uploads folder তৈরি করা হয়েছে:', uploadsDir)
}

app.use(
  '/uploads',
  express.static(uploadsDir, {
    maxAge: '7d',
    setHeaders: (res) => {
      // Cross-origin image load/download-এর জন্য
      res.set('Access-Control-Allow-Origin', '*')
      res.set('Cross-Origin-Resource-Policy', 'cross-origin')
    },
  })
)

// ---------- Routes ----------
app.use('/api/auth', authRoutes)
app.use('/api/clients', clientRoutes)

// Health check
app.get('/', (req, res) =>
  res.json({ message: 'Anondo Housing API চালু আছে ✅' })
)

// ---------- 404 handler (optional debug) ----------
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
})

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