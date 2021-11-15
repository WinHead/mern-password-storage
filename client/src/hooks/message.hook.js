// Для вывода сообщений (об ошибках) на экран

import {useCallback} from 'react'

export const useMessage = () => {
  return useCallback(text => {
    // Если существует объект
    if (window.M && text) {
      // Выводим toast с сообщением
      window.M.toast({ html: text })
    }
  }, [])
}
