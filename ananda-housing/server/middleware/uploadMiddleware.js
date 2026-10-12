// server/middleware/uploadMiddleware.js
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // unique public_id (filename without extension)
    const uniqueName =
      'client_' + Date.now() + '_' + Math.round(Math.random() * 1e9)

    return {
      folder: 'anondo-housing/clients',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: uniqueName,
      // বড় ছবি auto resize + compress
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good' },
      ],
    }
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('শুধু JPG, PNG, WEBP image গ্রহণ করা হয়'), false)
  }
}

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB (Cloudinary-তে auto compress হবে)
})