const express = require('express')
const router = express.Router()
const upload = require('../middleware/uploadMiddleware')
const auth = require('../middleware/authMiddleware')
const {
  createClient,
  getClients,
  deleteClient,
} = require('../controllers/clientController')

// Public — employee client add করবে
router.post('/', upload.single('photo'), createClient)

// Protected — শুধু admin সব client দেখবে
router.get('/', auth, getClients)

// Protected — শুধু admin client delete করবে
router.delete('/:id', auth, deleteClient)

module.exports = router