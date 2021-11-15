import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'

export const AuthPage = () => {
  // Получаем контекст
  const auth = useContext(AuthContext)
  // Инициализируем хук вывода сообщений
  const message = useMessage()
  // Добавляем наш хук загрузки, импортируя следующие функции:
  const {loading, request, error, clearError} = useHttp()
  const [form, setForm] = useState({
    email: '', password: ''
  })

  // Следим за ошибкой
  useEffect(() => {
    // Если есть ошибка, то выводим message для пользователя
    message(error)
    // После чего очищаем ошибки
    clearError()
  }, [error, message, clearError])

  // Добавляем эфеект, который позволяет сделать ввод снова активным

  // При редиректе
  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  // Для обработки формы
  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  // Осуществления запроса на сервер -> регистрация
  const registerHandler = async () => {
    try {
      // Получаем данные с сервера; Передаем путь, вид запроса и тело запроса: форму
      const data = await request('/api/auth/register', 'POST', {...form})
      // Выводим пользователяю сообщение об успешной регистрации
      message(data.message)
    } catch (e) {}  // Пустая обработка ошибок, т.к. мы уже все обработали в хуке useHTTP()
  }

  // Осуществления запроса на сервер -> вход
  const loginHandler = async () => {
    try {
      // Получаем данные с сервера; Передаем путь, вид запроса и тело запроса: форму
      const data = await request('/api/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId)
    } catch (e) {}  // Пустая обработка ошибок, т.к. мы уже все обработали в хуке useHTTP()
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Сохранение паролей</h1>

        <div className="card blue-grey darken-1">
          <div className="card-content white-text">
            <span className="card-title">Авторизация</span>
            <div>

              <div className="input-field">
                <input
                  placeholder="Введите email"
                  id="email"
                  type="text"
                  name="email"
                  className="yellow-input"
                  value={form.email}
                  onChange={changeHandler}
                />
                <label htmlFor="email">Email</label>
              </div>

              <div className="input-field">
                <input
                  placeholder="Введите пароль"
                  id="password"
                  type="password"
                  name="password"
                  className="yellow-input"
                  value={form.password}
                  onChange={changeHandler}
                />
                <label htmlFor="email">Пароль</label>
              </div>

            </div>
          </div>
          <div className="card-action">

            <button
              className="btn yellow darken-4"
              style={{marginRight: 10}}
              disabled={loading}
              onClick={loginHandler}
            >
              Войти
            </button>
            <button
              className="btn grey lighten-1 black-text"
              onClick={registerHandler}
              disabled={loading}
            >
              Регистрация
            </button>
          </div>
        </div>


      </div>
    </div>
  )
}
