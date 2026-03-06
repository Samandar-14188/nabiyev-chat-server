const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authMiddleware = require('../middleware/authMiddleware')

// ================================
// POST /api/auth/register
// Ro'yxatdan o'tish
// ================================
router.post('/register', async (req, res) => {
  try {
    // 1. Frontenddan kelgan ma'lumotlarni olamiz
    const { username, email, password } = req.body

    // 2. Tekshiramiz — bu email allaqachon bormi?
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email allaqachon ro\'yxatdan o\'tgan' })
    }

    // 3. Parolni shifrlаymiz (xavfsizlik uchun)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // 4. Yangi foydalanuvchi yaratamiz
    const newUser = new User({
      username,
      email,
      password: hashedPassword  // shifrlangan parol saqlanadi
    })

    // 5. MongoDB ga saqlaymiz
    await newUser.save()

    // 6. JWT token yaratamiz
    const token = jwt.sign(
      { id: newUser._id },           // token ichida user id bo'ladi
      process.env.JWT_SECRET,         // maxfiy kalit
      { expiresIn: '7d' }            // 7 kundan keyin eskiradi
    )

    // 7. Frontendga javob qaytaramiz
    res.status(201).json({
      message: 'Ro\'yxatdan o\'tdingiz! ✅',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    })

  } catch (err) {
    res.status(500).json({ message: 'Server xatolik', error: err.message })
  }
})

module.exports = router

// ================================
// POST /api/auth/login
// Tizimga kirish
// ================================
router.post('/login', async (req, res) => {
  try {
    // 1. Frontenddan email va parol olamiz
    const { email, password } = req.body

    // 2. Bu email bazada bormi?
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Email yoki parol noto\'g\'ri' })
    }

    // 3. Parolni tekshiramiz
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Email yoki parol noto\'g\'ri' })
    }

    // 4. JWT token yaratamiz
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 5. Frontendga javob qaytaramiz
    res.json({
      message: 'Xush kelibsiz! ✅',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })

  } catch (err) {
    res.status(500).json({ message: 'Server xatolik', error: err.message })
  }
})
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Token dan user id ni olamiz
    const user = await User.findById(req.user.id).select('-password')
    // select('-password') — parolni qaytarmaymiz!

    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server xatolik' })
  }
})