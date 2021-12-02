import React, {useEffect, useState} from 'react'
import {useMessage} from "../hooks/message.hook";
import {useHttp} from "../hooks/http.hook";

export const LinkCard = ({ link }) => {
  // Экспортируем bcrypt для сравнения хэшей
  const bcrypt = require('bcryptjs')
  // Инициализируем хук вывода сообщений
  const message = useMessage()
  // Добавляем наш хук загрузки, импортируя следующие функции:
  const {loading, request, error, clearError} = useHttp()
  const [form, setForm] = useState({
    password: ''
  })

  // Следим за ошибкой
  useEffect(() => {
    // Если есть ошибка, то выводим message для пользователя
    message(error)
    // После чего очищаем ошибки
    clearError()
  }, [error, message, clearError])

  // Для обработки формы
  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  // Осуществления запроса на сервер -> вход
  const comparisonHandler = async () => {
    try {
      // Сравниваем предполагаемый и реальный пароли
      const isMatch = await bcrypt.compare(form.password, link.pswrd)

      // И выводим соответствующие сообщения
      if (isMatch) {
        message("Пароли совпали")
      } else {
        message("Несовпадение паролей, попробуйте снова!")
      }

    } catch (e) {}  // Пустая обработка ошибок, т.к. мы уже все обработали в хуке useHTTP()
  }
  
  return (
    <>
      <h2>Ссылка</h2>

        <p>Наименование сайта: <strong>{link.name}</strong></p>
        <p>Ссылка на сайт: <a href={link.from} target="_blank" rel="noopener noreferrer">{link.from}</a></p>
        <p>Пароль: <strong>{link.pswrd}</strong></p>
        <p>Количество кликов по ссылке: <strong>{link.clicks}</strong></p>
        <p>Дата создания: <strong>{new Date(link.date).toLocaleDateString()}</strong></p>
      
      <div className="card blue-grey darken-1">
        <div className="card-content white-text">
          <span className="card-title">Сравнение паролей</span>
          <div>

            <div className="input-field">
              <input
                  placeholder=""
                  id="password"
                  type="text"
                  name="password"
                  className="yellow-input"
                  value={form.password}
                  onChange={changeHandler}
              />
              <label htmlFor="password">Ваш пароль</label>
            </div>

          </div>
        </div>
        <div className="card-action">

          <button
              className="btn yellow darken-4"
              style={{marginRight: 10}}
              disabled={loading}
              onClick={comparisonHandler}
          >
            Сравнить
          </button>
          
        </div>
      </div>
      
    </>
  )
}
