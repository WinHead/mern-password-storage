import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {useHistory} from 'react-router-dom'
import {useMessage} from "../hooks/message.hook";

export const CreatePage = () => {
  const history = useHistory()
  // Инициализируем хук вывода сообщений
  const message = useMessage()
  const auth = useContext(AuthContext)
  // Добавил loading
  const {loading, request} = useHttp()
  //const [link, setLink] = useState('')
  const [form, setForm] = useState({
    from: '', name: '', pswrd: ''
  })

  // Обновляем текстовый input
  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  // Для обработки формы
  const changeHandler = event => {
      setForm({...form, [event.target.name]: event.target.value})
  }

  // Обработка нажатия на кнопку
  const saveHandler = async () => {
    // При нажатии enter поля ввода

      try {
        // Кидаем запрос на link/generate
        const data = await request('/api/link/generate',
            'POST',
            {...form},         // Передаем: форму
            {Authorization: `Bearer ${auth.token}`  // Передаем авторизационный токен
        })

        // Делаем редирект на страницу ссылки
        history.push(`/detail/${data.link._id}`)

      } catch (e) {}
  }

  return (
    <div className="row">
      <div className="col s8 offset-s3" style={{paddingTop: '2rem'}}>

        <div className="card blue-grey darken-1">
          <div className="card-content white-text">
            <span className="card-title"></span>
            <div>

              <div className="input-field">
                <input
                    placeholder="Введите ссылку на сайт"
                    id="from"
                    type="text"
                    name="from"
                    className="yellow-input"
                    value={form.from}
                    onChange={changeHandler}
                />
                <label htmlFor="email">Ссылка на ваш ресурс</label>
              </div>

              <div className="input-field">
                <input
                    placeholder="Введите название ресурса"
                    id="name"
                    type="text"
                    name="name"
                    className="yellow-input"
                    value={form.name}
                    onChange={changeHandler}
                />
                <label htmlFor="email">Имя ресурса</label>
              </div>

              <div className="input-field">
                <input
                    placeholder="Введите пароль"
                    id="pswrd"
                    type="text"
                    name="pswrd"
                    className="yellow-input"
                    value={form.pswrd}
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
                onClick={saveHandler}
            >
              Сохранить
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}
