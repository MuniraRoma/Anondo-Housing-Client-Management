const express = require('express')
const router = express.Router()
const upload = require('../middleware/uploadMiddleware')
const auth = require('../middleware/authMiddleware')
const { createClient, getClients } = require('../controllers/clientController')

// Public — employee client add করবে
router.post('/', upload.single('photo'), createClient)

// Protected — শুধু admin সব client দেখবে
router.get('/', auth, getClients)

module.exports = router