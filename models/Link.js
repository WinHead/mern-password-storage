// Модель для ссылки

const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  // Поля:
  from:   {type: String, required: true},                 // Ссылка на сайт
  //to:     {type: String, required: true, unique: true},
  pswrd:  {type: String, required: true},                 // Пароль для этого сайта
  name:   {type: String, required: true, unique: true},   // Название ресурса
  code:   {type: String, required: true, unique: true},   // ID
  date:   {type: Date, default: Date.now},                // Дата добавления
  clicks: {type: Number, default: 0},                     // Число просмотров ссылки
  owner:  {type: Types.ObjectId, ref: 'User'}             // Пользоваткль, который её создал
})

module.exports = model('Link', schema)
