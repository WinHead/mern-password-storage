// Модель пользователя

const {Schema, model, Types} = require('mongoose')

// Схема работы
const schema = new Schema({
  // У пользователя будут поля:
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  // Ссылки пользователя
  links: [{ type: Types.ObjectId, ref: 'Link' }],  // Привязка к модели Link
})

module.exports = model('User', schema)
