const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

// ✨ NEW: Cloudinary config load করুন (startup-এ verify হবে)
require('./config/cloudinary')

const authRoutes = require('./routes/authRoutes')
const clientRoutes = require('./routes/clientRoutes')
const seedAdmin = require('./utils/seedAdmin')
const pool = require('./config/db')

const app = express()

// ---------- CORS ----------
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://anondo-housing.netlify.app',     // ⚠️ আপনার আসল Netlify URL দিয়ে replace করুন
  'https://anondohousing23.netlify.app',    // ✅ screenshot-এ যেটা দেখা গেছে
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      // Development-এর সুবিধার জন্য সব allow — production-এ চাইলে restrict করুন
      return callback(null, true)
    },
    credentials: true,
  })
)

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// ---------- Static uploads (backward compatibility) ----------
// Cloudinary-তে migrate করার পর এটা আর দরকার নেই,
// কিন্তু পুরনো কিছু image reference থাকলে কাজে দেবে
const uploadsDir = path.join(__dirname, 'uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('📁 uploads folder তৈরি করা হয়েছে:', uploadsDir)
}

app.use(
  '/uploads',
  express.static(uploadsDir, {
    maxAge: '7d',
    setHeaders: (res) => {
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

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Server চালু হয়েছে পোর্ট ${PORT}-এ`)

  // ✨ NEW: Cloudinary config verify log
  console.log(
    '☁️  Cloudinary:',
    process.env.CLOUDINARY_CLOUD_NAME
      ? `✅ ${process.env.CLOUDINARY_CLOUD_NAME}`
      : '❌ NOT SET'
  )

  try {
    await pool.query('SELECT 1')
    console.log('✅ MySQL connection সফল')
    await seedAdmin()
  } catch (err) {
    console.error('❌ Startup error:', err.message)
  }
})