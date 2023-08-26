const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле name должно быть заполнено'],
    minLength: [2, 'Минимальная длина поля - 2 символа'],
    maxLength: [30, 'Максимальная длина поля - 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'Поле link должно быть заполнено'],
    validate: {
      validator: (url) => {
        validator.isURL(url);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
}, { versionKey: false });
module.exports = mongoose.model('card', cardSchema);
