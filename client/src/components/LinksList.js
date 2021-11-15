import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";

export const LinksList = ({ links }) => {
    const {request} = useHttp()
    const auth = useContext(AuthContext)

    // Если пока нет списка ссылок
  if (!links.length) {
    return <p className="center">Пока что здесь ничего нет</p>
  }


  return (
    <table>
      <thead>
      <tr>
          <th>№</th>
          <th>Ссылка на сайт</th>
          <th>Наименование ресурса</th>
          <th>Действие</th>
          <th></th>
          <th>
              <ul className="menu">
                  <li><a href=" ">Сожный вывод</a>
                      <ul>
                          <li><a onClick={async () => {
                              window.location = window.location.href.split('/links')[0] + "/links/100"
                          }}>Вывод простых паролей</a></li>
                          <li><a onClick={async () => {
                              window.location = window.location.href.split('/links')[0] + "/links/101"
                          }}>Вывод средних паролей</a></li>
                          <li><a onClick={async () => {
                              window.location = window.location.href.split('/links')[0] + "/links/102"
                          }}>Вывод сложных паролей</a></li>
                      </ul>
                  </li>
              </ul>
          </th>
          <th>
            <ul className="menu">
                <li><a href="">Отсортировать</a>
                    <ul>
                        <li><a onClick={async () => {
                            window.location = window.location.href.split('/links')[0] + "/links/1"
                        }}>По популярности</a></li>
                        <li><a onClick={async () => {
                            window.location = window.location.href.split('/links')[0] + "/links/-1"
                        }}>По непопулярности</a></li>
                        <li><a onClick={async () => {
                            window.location = window.location.href.split('/links')[0] + "/links/0"
                        }}>По дате добавления</a></li>
                    </ul>
                </li>
            </ul>
          </th>
      </tr>
      </thead>

      <tbody>
      { links.map((link, index) => {
        return (
          <tr key={link._id}>
              <td>{index + 1}</td>
              <td>{link.from}</td>
              <td>{link.name}</td>

              <th>
                  <Link to={`/detail/${link._id}`}>Открыть</Link>
              </th>

              <th>
                  <a href="#" onClick={async () => {
                      const data = await request(`/api/link/delete/${link._id}`, 'POST',
                          null,         // Передаем: форму
                          {Authorization: `Bearer ${auth.token}`  // Передаем авторизационный токен
                          })
                      window.location.reload();
                  }}>Удалить</a>
              </th>
          </tr>
        )
      }) }
      </tbody>
    </table>
  )
}
