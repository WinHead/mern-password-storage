// Главный файл сервера

// Подключаем зависмости
const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')

// Инициализируем наш сервер
const app = express()

app.use(express.json({ extended: true }))

// Регистрируем роуты авторизации, ссылки и дефолтного пути
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))

// Для продакшена необходимо отпраялть фронтенд
if (process.env.NODE_ENV === 'production') {
  // Если идет запрос на корень приложения, указываем нашу статическую папку клиента
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  // На любые другие запросы отправляем файлы:
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

// Получаем порт, если нет, то используем порт 5000
const PORT = config.get('port') || 5000

// Делаем функцию ассинхронной для возможности использования await
async function start() {
  try {
    // Ждем завершения промиса connect
    await mongoose.connect(config.get('mongoUri'), {
      // Параметры для успешной работы коннекта
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    // Слушаем порт и выводим в консоль сообщение об успешном старте сервера
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))

  } catch (e) {
    // Если что-то пошло не так, озвращаем 1 и печатаем сообщение об ошибке
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()

