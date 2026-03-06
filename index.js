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
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))

app.get('/', (req, res) => {
  res.json({ message: 'Server ishlayapti! ✅' })
})

// Socket.io
const socketHandler = require('./socket/socketHandler')
socketHandler(io)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB ulandi ✅')
    server.listen(process.env.PORT, () => {
      console.log(`Server ${process.env.PORT} portda ishlamoqda 🚀`)
    })
  })
  .catch((err) => console.log('MongoDB xatolik:', err))
  app.use('/api/users', require('./routes/users'))
  app.use('/api/messages', require('./routes/messages'))