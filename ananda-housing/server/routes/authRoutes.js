const express = require('express')
const router = express.Router()
const {
  login,
  changePassword,
  changeEmail,
  forgotPassword,
} = require('../controllers/authController')
const auth = require('../middleware/authMiddleware')

router.post('/login', login)
router.post('/change-password', auth, changePassword)
router.post('/change-email', auth, changeEmail)
router.post('/forgot-password', forgotPassword)

module.exports = router