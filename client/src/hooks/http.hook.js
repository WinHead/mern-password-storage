import {useState, useCallback} from 'react'

export const useHttp = () => {
  // Внутри этого хука мы сами определеяем грузится ли что-то на сервер ил инет
  // И в дальнейшем будем взаимодействовать с этим флаагом
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Запрос принимает url, метод (GET по умолчанию), тело и заголовки
  const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    // Начало загрузки -> устанавливаем флаг
    setLoading(true)
    try {

      // Если мы передаем body, то преобразуем его в json
      if (body) {
        body = JSON.stringify(body)
        // Явно указываем, что передаем json
        headers['Content-Type'] = 'application/json'
      }

      // fetch - отправляет на сервер запрос, получем ответ и передаем его в переменную
      const response = await fetch(url, {method, body, headers})
      // Получаем из ответа сервера .json файл
      const data = await response.json()

      // Если ошибка
      if (!response.ok) {
        // Выкидываем ошибку, её massage или стандартное сообщение об ошибке
        throw new Error(data.message || 'Что-то пошло не так')
      }

      // Конец загрузки -> меняем флаг
      setLoading(false)

      // Если с запросом все хорошо, возвращаем данные с сервера
      return data

    } catch (e) {
      // В случае какой-то ошибки устанавливаем флаг конца загрузки
      setLoading(false)
      // И выводим message ошибки
      setError(e.message)
      // После чего выбрасываем само исключение
      throw e
    }
  }, [])

  // Так же экспортируем функцию чистки ошибок
  // Оборачиваем в useCallback для корректной работы
  // Иначе мы очищаем ошибки до их вывода
  const clearError = useCallback(() => setError(null), [])

  return { loading, request, error, clearError }
}
