const express = require('express')
const router = express.Router()
const User = require('../models/User')
const authMiddleware = require('../middleware/authMiddleware')

// GET /api/users — barcha foydalanuvchilar
router.get('/', authMiddleware, async (req, res) => {
  try {
    // O'zimizdan boshqa barcha userlarni olamiz
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('-password')  // parolsiz

    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Server xatolik' })
  }
})

module.exports = router