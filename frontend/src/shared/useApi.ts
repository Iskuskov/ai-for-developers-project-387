import { useEffect, useState } from 'react'

/** Ответ SDK: у клиента hey-api поля data и error опциональны. */
export interface ApiResult<T> {
  data?: T
  error?: unknown
}

/**
 * Загрузка данных API внутри эффекта: состояние data и hasError с отменой устаревшего ответа при
 * размонтировании и смене зависимостей. Новый запуск эффекта сбрасывает прежние данные — вместо
 * устаревшей выдачи вызывающий показывает загрузку.
 */
export function useApi<T>(
  load: () => Promise<ApiResult<T>>,
  deps: readonly unknown[],
): { data: T | null; hasError: boolean } {
  const [data, setData] = useState<T | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setData(null)
    setHasError(false)
    load()
      .then((result) => {
        if (!cancelled) {
          if (result.error) {
            setHasError(true)
          } else {
            setData(result.data ?? null)
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHasError(true)
        }
      })
    return () => {
      cancelled = true
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- зависимости задаёт вызывающий: хук не знает, что захвачено в load
  }, deps)

  return { data, hasError }
}
