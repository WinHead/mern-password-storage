// Контекст приложения

import {createContext} from 'react'

function noop() {}

// Создаем контекст
export const AuthContext = createContext({
  // Передаем параметры по умолчанию
  token: null,
  userId: null,
  login: noop,  // noop - пустая функция
  logout: noop,
  isAuthenticated: false
})
