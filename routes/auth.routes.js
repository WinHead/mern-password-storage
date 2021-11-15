// Роут авторизации

// Подгрузка необходимых компонентов
const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')

// Инициализируем наш роут
const router = Router()

// Обработка post запроса регистрации
router.post(
  '/register',
  // Массив для валидации (Проверок пароля)
  [
      check('email', 'Некорректный email').isEmail(),
      check('password', 'Минимальная длина пароля 6 символов')
      .isLength({ min: 6 })
  ],
  async (req, res) => {
  try {
    // Создаем переменную с ошибками валидации
    const errors = validationResult(req)

    // Если есть какие-то ошибки
    if (!errors.isEmpty()) {
      // Передаем на фронтенд json с ошибками
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные при регистрации'
      })
    }

    // Получаем с фронтенда email и password
    const {email, password} = req.body

    // Переменная - кандидат на пользователя
    // Ждем, пока не найдем пользователя по email
    const candidate = await User.findOne({ email })

    // Если мы нашли кандидата
    if (candidate) {
      // Выводим сообщение о существовании пользователя в базе
      return res.status(400).json({ message: 'Такой пользователь уже существует' })
    }

    // Создаем переменную хешированного пароля
    const hashedPassword = await bcrypt.hash(password, 12)
    // Создаем нового пользователя
    const user = new User({ email, password: hashedPassword })

    // Ждем пока пользователь сохранится
    await user.save()

    // Возвращаем сообщение о создании пользователя
    res.status(201).json({ message: 'Пользователь создан' })

  } catch (e) {
    // Если что-то пошло не так, то выводим сообщение об ошибке и возращаем 500 код
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})




// Обработка post запроса логина
router.post(
  '/login',
    // Массив для валидации (Проверок пароля)
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
  try {
    // Создаем переменную с ошибками валидации
    const errors = validationResult(req)

    // Если есть какие-то ошибки
    if (!errors.isEmpty()) {
      // Передаем на фронтенд json с ошибками
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные при входе в систему'
      })
    }
    // Получаем с фронтенда email и password
    const {email, password} = req.body
    // Находим пользователя
    const user = await User.findOne({ email })

    // Если пользователь не создан
    if (!user) {
      // Отправляем json на клиента
      return res.status(400).json({ message: 'Пользователь не найден' })
    }
    // Проверка на совпадение паролей
    const isMatch = await bcrypt.compare(password, user.password)

    // Если пароли не совпадают
    if (!isMatch) {
      // Возвращаем сообщение об ошибке
      return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
    }

    // Создаем токен
    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),      // Секретный ключ
      { expiresIn: '1h' }    // Токен действует 1 час
    )

    // Формиоуем ответ юзеру
    res.json({ token, userId: user.id })

  } catch (e) {
    // В случае ошибки выводим сообщение об ошибке
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})


module.exports = router
