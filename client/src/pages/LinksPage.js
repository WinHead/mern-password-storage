import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/Loader'
import {LinksList} from '../components/LinksList'
import {useParams} from "react-router-dom"

export const LinksPage = () => {
  const [links, setLinks] = useState([])
  const {loading, request} = useHttp()
  const {token} = useContext(AuthContext)
  const sort = useParams().sort

  // Функция для загрузки списка
  const fetchLinks = useCallback(async () => {
    try {
      // Отпраляем GET запрос с нужным вариантом сортировки
      const fetched = await request(`/api/link/sort/${sort}`,
          'GET',
          null,
          {Authorization: `Bearer ${token}`
      })
      // Локально формируем массив ссылок
      setLinks(fetched)

    } catch (e) {}
  }, [token, request])

  // Когда мы можем делать запрос
  useEffect(() => {
    // Вызываем функцию, описанную выше
    fetchLinks()
  }, [fetchLinks])

  // Если происходит процесс загрузки
  if (loading) {
    return <Loader/>
  }

  return (
    <>
      {!loading && <LinksList links={links} />}
    </>
  )
}
