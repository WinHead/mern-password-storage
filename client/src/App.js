// Клиентское приложение

import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from './routes'
import {useAuth} from './hooks/auth.hook'
import {AuthContext} from './context/AuthContext'
import {Navbar} from './components/Navbar'
import {Loader} from './components/Loader'
import 'materialize-css'

// Наш клиент
function App() {
  // экспортируем данные из useAuth()
  const {token, login, logout, userId, ready} = useAuth()
  // Флаг, зарегистрирован ли пользователь в системе
  const isAuthenticated = !!token

  // Создаем маршруты
  const routes = useRoutes(isAuthenticated)

  if (!ready) {
    return <Loader />
  }

  return (
      // Оборачиваем все в контекст
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated
    }}>
      <Router>
        { isAuthenticated && <Navbar /> }
        <div className="container">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
