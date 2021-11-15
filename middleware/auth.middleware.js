// Функция перехватывает данные перед обработкой сервера
// Выполняем проверки на наличие токена и пересылаем его дальше (если есть)

const jwt = require('jsonwebtoken')
const config = require('config')

// next - следующий шаг обработки
module.exports = (req, res, next) => {
  // Проверяем доступность сервера
  if (req.method === 'OPTIONS') {
    // Продолжаем делать запрос
    return next()
  }

  // Если это обычный запрос ( пост или гет)
  try {
    // Получаем токен
    const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"

    // Если токена нет
    if (!token) {
      // Отпраляем 401 статус
      return res.status(401).json({ message: 'Нет авторизации' })
    }

    // Если токен есть, раскодируем токен
    const decoded = jwt.verify(token, config.get('jwtSecret'))
    // Кладем его в объект request
    req.user = decoded
    next()

  } catch (e) {
    // Отпраляем 401 статус
    res.status(401).json({ message: 'Нет авторизации' })
  }
}
