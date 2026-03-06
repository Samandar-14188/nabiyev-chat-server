const mongoose = require('mongoose')


const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',      // User modeliga bog'liq
      required: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    text: {
      type: String,
      required: true
    },

    isRead: {
      type: Boolean,
      default: false    // dastlab o'qilmagan
    }
  },
  {
    timestamps: true
  }
)

const Message = mongoose.model('Message', messageSchema)
module.exports = Message