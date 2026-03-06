const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {
    // 1. Headerdan tokenni olamiz
    const token = req.headers.authorization?.split(' ')[1]
    // "Bearer eyJhbGci..." → "eyJhbGci..."

    // 2. Token bormi?
    if (!token) {
      return res.status(401).json({ message: 'Token yo\'q, ruxsat yo\'q!' })
    }

    // 3. Tokenni tekshiramiz
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 4. User ma'lumotini so'rovga qo'shamiz
    req.user = decoded

    // 5. Keyingi funksiyaga o'tamiz
    next()

  } catch (err) {
    res.status(401).json({ message: 'Token noto\'g\'ri!' })
  }
}

module.exports = authMiddleware
