// server/config/cloudinary.js
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Config ঠিকভাবে লোড হয়েছে কিনা verify করুন
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.warn('⚠️  CLOUDINARY_CLOUD_NAME set করা নেই!')
}
if (!process.env.CLOUDINARY_API_KEY) {
  console.warn('⚠️  CLOUDINARY_API_KEY set করা নেই!')
}
if (!process.env.CLOUDINARY_API_SECRET) {
  console.warn('⚠️  CLOUDINARY_API_SECRET set করা নেই!')
}

module.exports = cloudinary