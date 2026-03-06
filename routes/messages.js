const express = require('express')
const router = express.Router()
const Message = require('../models/Message')
const authMiddleware = require('../middleware/authMiddleware')
const mongoose = require('mongoose')
// PATCH /api/messages/read/:senderId
// Xabarlarni o'qilgan deb belgilash
router.patch('/read/:senderId', authMiddleware, async (req, res) => {
  try {
    await Message.updateMany(
      {
        sender: req.params.senderId,
        receiver: req.user.id,
        isRead: false
      },
      { isRead: true }
    )
    res.json({ message: 'O\'qildi' })
  } catch (err) {
    res.status(500).json({ message: 'Server xatolik' })
  }
})

// GET /api/messages/unread
// O'qilmagan xabarlar soni
router.get('/unread', authMiddleware, async (req, res) => {
  try {
    const unread = await Message.aggregate([
      {
        $match: {
          receiver: new mongoose.Types.ObjectId(req.user.id),
          isRead: false
        }
      },
      {
        $group: {
          _id: '$sender',
          count: { $sum: 1 }
        }
      }
    ])
    res.json(unread)
  } catch (err) {
    res.status(500).json({ message: 'Server xatolik' })
  }
})
// GET /api/messages/:receiverId
// Ikki kishi orasidagi xabarlarni olish
router.get('/:receiverId', authMiddleware, async (req, res) => {
  try {
    const senderId = req.user.id
    const { receiverId } = req.params

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ createdAt: 1 })  // eskidan yangiga

    res.json(messages)
  } catch (err) {
    res.status(500).json({ message: 'Server xatolik' })
  }
})

module.exports = router