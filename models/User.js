const mongoose = require('mongoose')

// Schema — foydalanuvchi qanday ma'lumot saqlaydi
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,       // matn
      required: true,     // majburiy
      unique: true,       // takrorlanmaydi
      trim: true,         // bo'sh joy olib tashlaydi
      minlength: 3        // kamida 3 ta harf
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true     // katta harfni kichikka o'giradi
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    avatar: {
      type: String,
      default: ''         // bo'sh — keyinchalik rasm qo'shamiz
    },

    isOnline: {
      type: Boolean,
      default: false      // dastlab offline
    }
  },
  {
    timestamps: true      // createdAt, updatedAt avtomatik qo'shiladi
  }
)

// Modelni export qilamiz
const User = mongoose.model('User', userSchema)
module.exports = User