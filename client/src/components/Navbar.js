// Навигационный бар

import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'

export const Navbar = () => {
  const history = useHistory()
  // Контекст
  const auth = useContext(AuthContext)

  // Обработка события -> пользователь нажал на кнопку "выйти"
  const logoutHandler = event => {
    // Дефолтное поведение
    event.preventDefault()
    // Выходим
    auth.logout()
    // Редирект на главную страницу
    history.push('/')
  }

  return (
    <nav>
      <div className="nav-wrapper blue-grey darken-1" style={{ padding: '0 2rem' }}>
        <span className="brand-logo">Кладовая паролей</span>
        <ul id="nav-mobile" className="right hide-on-med-and-down">

          <li><NavLink to="/create">Создать</NavLink></li>
          <li><NavLink to="/links/0">Ваши ссылки</NavLink></li>
          <li><NavLink to="/info">О проекте</NavLink></li>
          <li><a href="/" onClick={logoutHandler}>Выйти</a></li>
        </ul>
      </div>
    </nav>
  )
}
