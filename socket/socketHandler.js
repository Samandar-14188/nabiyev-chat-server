const Message = require('../models/Message')

const socketHandler = (io) => {
  // Online userlarni saqlaymiz
  const onlineUsers = new Map()
  // { userId: socketId }

  io.on('connection', (socket) => {
    console.log('Foydalanuvchi ulandi:', socket.id)

    // ================================
    // 1. User online bo'lganda
    // ================================
    socket.on('user_connected', (userId) => {
      onlineUsers.set(userId, socket.id)
      
      // Hammaga online userlar ro'yxatini yuboramiz
      io.emit('online_users', Array.from(onlineUsers.keys()))
      console.log('Online userlar:', Array.from(onlineUsers.keys()))
    })

    // ================================
    // 2. Xabar yuborilganda
    // ================================
    socket.on('send_message', async (data) => {
      const { senderId, receiverId, text } = data

      // MongoDB ga saqlaymiz
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        text
      })
      await message.save()

      // Qabul qiluvchiga yuboramiz
      const receiverSocketId = onlineUsers.get(receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new_message', message)
      }

      // Yuboruvchiga ham qaytaramiz
      socket.emit('new_message', message)
    })

    // ================================
    // 3. User yozayotganda
    // ================================
    socket.on('typing', ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', senderId)
      }
    })

    // ================================
    // 4. User offline bo'lganda
    // ================================
    socket.on('disconnect', () => {
      onlineUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          onlineUsers.delete(userId)
        }
      })
      io.emit('online_users', Array.from(onlineUsers.keys()))
      console.log('Foydalanuvchi uzildi:', socket.id)
    })
  })
}

module.exports = socketHandler
