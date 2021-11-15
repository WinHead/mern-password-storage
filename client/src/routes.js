import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {LinksPage} from './pages/LinksPage'
import {CreatePage} from './pages/CreatePage'
import {DetailPage} from './pages/DetailPage'
import {AuthPage} from './pages/AuthPage'
import {InfoPage} from "./pages/InfoPage";


export const useRoutes = isAuthenticated => {
    // Если пользователь идентифицирован
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/links/:sort" exact>
          <LinksPage />
        </Route>

        <Route path="/create" exact>
          <CreatePage />
        </Route>

        <Route path="/detail/:id">
          <DetailPage />
        </Route>

          <Route path="/info" exact>
              <InfoPage />
          </Route>

          <Redirect to="/create" />

      </Switch>
    )
  }

  // По умолчнию:
  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  )
}
