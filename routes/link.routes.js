// Роутер для ссылки

const {Router} = require('express')
const config = require('config')
const shortid = require('shortid')
const Link = require('../models/Link')
const auth = require('../middleware/auth.middleware')
const router = Router()


function checkPassword(password){
  let s_letters = "qwertyuiopasdfghjklzxcvbnm"; // Буквы в нижнем регистре
  let b_letters = "QWERTYUIOPLKJHGFDSAZXCVBNM"; // Буквы в верхнем регистре
  const digits = "0123456789"; // Цифры
  const specials = "!@#$%^&*()_-+=/.,:;[]{}"; // Спецсимволы
  let is_s = false; // Есть ли в пароле буквы в нижнем регистре
  let is_b = false; // Есть ли в пароле буквы в верхнем регистре
  let is_d = false; // Есть ли в пароле цифры
  let is_sp = false; // Есть ли в пароле спецсимволы
  for (let i = 0; i < password.length; i++) {
    /* Проверяем каждый символ пароля на принадлежность к тому или иному типу */
    if (!is_s && s_letters.indexOf(password[i]) != -1) is_s = true;
    else if (!is_b && b_letters.indexOf(password[i]) != -1) is_b = true;
    else if (!is_d && digits.indexOf(password[i]) != -1) is_d = true;
    else if (!is_sp && specials.indexOf(password[i]) != -1) is_sp = true;
  }
  let rating = 0;
  let text = "";
  if (is_s) rating++; // Если в пароле есть символы в нижнем регистре, то увеличиваем рейтинг сложности
  if (is_b) rating++; // Если в пароле есть символы в верхнем регистре, то увеличиваем рейтинг сложности
  if (is_d) rating++; // Если в пароле есть цифры, то увеличиваем рейтинг сложности
  if (is_sp) rating++; // Если в пароле есть спецсимволы, то увеличиваем рейтинг сложности
  /* Далее идёт анализ длины пароля и полученного рейтинга, и на основании этого готовится текстовое описание сложности пароля */
  if (password.length < 6 && rating < 3) text = "Простой";
  else if (password.length < 6 && rating >= 3) text = "Средний";
  else if (password.length >= 8 && rating < 3) text = "Средний";
  else if (password.length >= 8 && rating >= 3) text = "Сложный";
  else if (password.length >= 6 && rating == 1) text = "Простой";
  else if (password.length >= 6 && rating > 1 && rating < 4) text = "Средний";
  else if (password.length >= 6 && rating == 4) text = "Сложный";

  return text; // Форму не отправляем
}



// Обрабатываем post запрос generate, позволяющий создать ссылку
router.post('/generate', auth, async (req, res) => {
  try {

    // Получаем стандартный url
    const baseUrl = config.get('baseUrl')
    // Получаем данные из body
    const {from, name, pswrd} = req.body

    // Получаем уникальный код
    const code = shortid.generate()
    //console.log(`Сгенерировали код: ${code}`)

    // Проверяем, существует ли аналогичная ссылка
    const existing = await Link.findOne({ from })
    //console.log(`existing: ${existing}`)

    // Если у нас в базе уже есть такая ссылка
    if (existing) {
      // Отправляем ее
      return res.json({ link: existing })
    }

    // Создаем новую ссылку
    const link = new Link({
      code: code, name: name, pswrd: pswrd, from: from, owner: req.user.userId
    })
    //console.log(`создали ссылку: code: ${code}, name: ${name}, pswrd: ${pswrd}, from: ${from}, owner: ${req.user.userId}`)

    // Сохранякм ссылку в БД
    await link.save()
    //console.log('сохранили ссылку')

    // Возвращаем ссылку в json
    res.status(201).json({ link })
    //console.log('Вернули ссылку')
  } catch (e) {
    console.log(`catch (${e})`)
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get запрос для получения всех ссылок
router.get('/', auth, async (req, res) => {
  try {
    // Ждем, пока ищем все ссылки по текущему пользователю
    const links = await Link.find({ owner: req.user.userId })
    // Возвращаем links
    res.json(links)
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get запрос для получения всех ссылок, отсортирвоанных по-возрастанию параметра clicks
router.get('/sort/:sort', auth, async (req, res) => {
  try {
    // Ждем, пока ищем все ссылки по текущему пользователю
    let links = await Link.find({owner: req.user.userId})

    // Получаем параметр сортировки
    const sort = req.params.sort

    // Проверяем чему равен параметр сортировки и выолням соответствующий вид сортировки
    if (sort == 1)
    {
    // Сортируем массив по убыванию
    links.sort((prev, next) => next.clicks - prev.clicks);
    } else if (sort == -1)
    {
      // Сортируем массив по возрастанию
      links.sort((prev, next) => prev.clicks - next.clicks);
    } else if (sort == 100)   // Если код = 100, то выводим Простые пароли
    {
      // Перебираем все ссылки юзера
      links = links.filter(function (link) {
        // Если нашли простую
        // Добавляем её в итоговый массив
        if (checkPassword(link.pswrd) == "Простой") {return true } else {return false}
      })
      console.log(`Полученные ссылки: ${links.length} `)
    } else if (sort == 101)   // Если код = 101, то выводим средние пароли
    {
      // Перебираем все ссылки юзера
      links = links.filter(function (link) {
        // Если нашли простую
        // Добавляем её в итоговый массив
        if (checkPassword(link.pswrd) == "Средний") {return true } else {return false}
      })
      console.log(`Полученные ссылки: ${links.length} `)
    } else if (sort == 102)   // Если код = 101, то выводим средние пароли
    {
      // Перебираем все ссылки юзера
      links = links.filter(function (link) {
        // Если нашли простую
        // Добавляем её в итоговый массив
        if (checkPassword(link.pswrd) == "Сложный") {return true } else {return false}
      })
    }

    // Возвращаем links
    res.json(links)

  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get запрос для получения ссылки по id
router.get('/:id', auth, async (req, res) => {
  try {

    // Ждем, пока ищем ссылки конкрентного пользователя
    const link = await Link.findById(req.params.id)

    // Увеличиввем счетчик нажатий
    link.clicks++
    // И сохраняем результат
    await link.save()

    // Возвращаем ссылку, завернутую в json
    res.json(link)

  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// post запрос для удаления ссылки по id
router.post('/delete/:id', auth, async (req, res) => {
  try {

    console.log('Запрос на удаление записи инициализирвоан клиентом')
    // ищем ссылку конкрентного пользователя
    const link = await Link.findById(req.params.id)

    // Удаляем запись из БД
    await link.remove()

    // Возвращаем статус ответа
    return res.status(201).json({message: "Успешное удаление записи"});

  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})


// Экспортируем роутер
module.exports = router
