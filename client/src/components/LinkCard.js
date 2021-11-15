import React from 'react'

export const LinkCard = ({ link }) => {
  return (
    <>
      <h2>Ссылка</h2>

        <p>Наименование сайта: <strong>{link.name}</strong></p>
        <p>Ссылка на сайт: <a href={link.from} target="_blank" rel="noopener noreferrer">{link.from}</a></p>
        <p>Пароль: <strong>{link.pswrd}</strong></p>
        <p>Количество кликов по ссылке: <strong>{link.clicks}</strong></p>
        <p>Дата создания: <strong>{new Date(link.date).toLocaleDateString()}</strong></p>
    </>
  )
}
