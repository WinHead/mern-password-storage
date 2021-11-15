// Модуль для авторизации

import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
  // State токена
  const [token, setToken] = useState(null)
  // Добавляем флаг, отработал ли модуль авторизации
  const [ready, setReady] = useState(false)
  // State юзера
  const [userId, setUserId] = useState(null)

  // Для входа
  // Принимаем токен и id юзера
  const login = useCallback((jwtToken, id) => {
    // Устанавливаем Токен и id
    setToken(jwtToken)
    setUserId(id)

    // Записываем в localStorage userId и token
    localStorage.setItem(storageName, JSON.stringify({
      userId: id, token: jwtToken
    }))
  }, [])


  // Для выхода
  const logout = useCallback(() => {
    // Чистим значения и localStorage
    setToken(null)
    setUserId(null)
    localStorage.removeItem(storageName)
  }, [])

  // Сотрим, есть ли данные в localStorage
  // Если есть, автоматически записываем в локальное состояние
  useEffect(() => {
    // Приводим к объекту
    const data = JSON.parse(localStorage.getItem(storageName))

    // Если есть data и в ней есть token
    if (data && data.token) {
      // Заходим с токеном и userId
      login(data.token, data.userId)
    }
    setReady(true)
  }, [login])


  return { login, logout, token, userId, ready }
}
