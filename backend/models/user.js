const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { ErrorUnAuthorization } = require('../errors/errorUnAuthorization');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => {
        validator.isEmail(email);
      },
      message: 'Некорректный email!',
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
  },
  name: {
    type: String,
    minLength: [2, 'Минимальная длина поля - 2 символа'],
    maxLength: [30, 'Максимальная длина поля - 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: [2, 'Минимальная длина поля - 2 символа'],
    maxLength: [30, 'Максимальная длина поля - 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (url) => {
        validator.isURL(url);
      },
      message: 'В поле должен быть URL!',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrorUnAuthorization('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ErrorUnAuthorization('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
