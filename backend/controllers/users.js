const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { SALT_ROUND } = require('../consts/consts');

const { JWT_SECRET = 'my-secret-key' } = process.env;

const { ErrorNotFound } = require('../errors/errorNotFound');

const { ErrorBadRequest } = require('../errors/errorBadRequest');

const { ErrorValidation } = require('../errors/errorValidation');

const { ErrorConflict } = require('../errors/errorConflict');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new ErrorNotFound('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    next(new ErrorBadRequest('Email и пароль обязательны для заполнения!'));
  }

  bcrypt.hash(password, SALT_ROUND)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }).then((user) => {
        const { _id } = user;
        res.status(201).send(
          {
            _id,
            name,
            about,
            avatar,
            email,
          },
        );
      })
        .catch((err) => {
          if (err.name === 'MongoServerError' || err.code === 11000) {
            next(new ErrorConflict('Пользователь с таким email уже существует!'));
          }
          if (err.name === 'ValidationError') {
            next(new ErrorValidation(err.message));
          }
          next(err);
        });
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  if (!name || !about) {
    next(new ErrorBadRequest('Переданы некорректные данные при обновлении профиля.'));
  }
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new ErrorValidation(err.message));
        } else {
          next(new ErrorNotFound('Пользователь по указанному _id не найден.'));
        }

        next(err);
      });
  }
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    next(new ErrorBadRequest('Переданы некорректные данные при обновлении Аватара.'));
  }
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new ErrorValidation(err.message));
        } else {
          next(new ErrorNotFound('Пользователь по указанному _id не найден.'));
        }

        next(err);
      });
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);

      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res
        .status(200)
        .send({ token });
    })
    .catch((err) => next(err));
};

module.exports.getUserMe = (req, res, next) => {
  const { _id } = req.user;
  console.log(_id);
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return next(new ErrorNotFound('Пользователь по указанному _id не найден.'));
      }

      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};
