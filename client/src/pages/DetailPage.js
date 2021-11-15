import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/Loader'
import {LinkCard} from '../components/LinkCard'

export const DetailPage = () => {
  const {token} = useContext(AuthContext)
  const {request, loading} = useHttp()
  const [link, setLink] = useState(null)
  // Ключ из роутов (id нашей ссылки, по которой мы можем сделать запрос)
  const linkId = useParams().id


  // Метод, который позволит загрузить ссылку
  const getLink = useCallback(async () => {
    try {
      // Отправляем на сервер GET запрос по id ссылки
      const fetched = await request(`/api/link/${linkId}`, 'GET', null, {
        Authorization: `Bearer ${token}`  // Добавляем токен авторизации
      })
      // Локально формируем ссылку
      setLink(fetched)
    } catch (e) {}
  }, [token, linkId, request])


  // Когда мы можем делать запрос
  useEffect(() => {
    // Вызываем метод, описанный выше
    getLink()
  }, [getLink])

  // Проверяем флаг loading
  if (loading) {
    return <Loader />
  }

  // Показываем компонент link
  return (
    <>
      { !loading && link && <LinkCard link={link} /> }
    </>
  )
}
