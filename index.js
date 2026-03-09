const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors({ origin: '*' }))  // ← o'zgartirildi
app.use(express.json())

// Routes — hammasi bu yerda! ← to'g'ri joy
app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/messages', require('./routes/messages'))

app.get('/', (req, res) => {
  res.json({ message: 'Server ishlayapti! ✅' })
})

// Socket.io
const socketHandler = require('./socket/socketHandler')
socketHandler(io)

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB ulandi ✅')
    server.listen(process.env.PORT, () => {
      console.log(`Server ${process.env.PORT} portda ishlamoqda 🚀`)
    })
  })
  .catch((err) => console.log('MongoDB xatolik:', err))