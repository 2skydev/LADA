import { useAtomValue } from 'jotai'
import useSWR, { SWRConfiguration } from 'swr'

import { leagueAtom } from '@renderer/stores/atoms/league.atom'

import { useDidUpdateEffect } from './useDidUpdateEffect'

export interface useAPIOptions extends SWRConfiguration {
  payload?: any
  revalidateOnLeagueReconnect?: boolean
}

type APICategory = 'league' | 'ps'

const useAPI = <T = any>(category: APICategory, url: string, options: useAPIOptions = {}) => {
  const { payload, revalidateOnLeagueReconnect = false, ...swrOptions } = options

  const { isReady } = useAtomValue(leagueAtom)

  let key: any = [category, url, payload]

  if (category === 'league' && !isReady) key = null

  const swr = useSWR<T>(key, {
    keepPreviousData: true,
    revalidateIfStale: true,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fetcher: async ([category, url, payload]: [APICategory, string, any]) => {
      const response = await window.electron.apis(category, url, payload)
      console.groupCollapsed(`%c[useAPI - ${category}]`, 'color: grey', url, payload || '')
      console.log(response)
      console.groupEnd()

      if (response?.errorCode) throw new Error(response?.message || 'Unknown Error')

      return response
    },
    ...swrOptions,
  })

  useDidUpdateEffect(() => {
    if (revalidateOnLeagueReconnect && isReady) swr.mutate()
  }, [isReady])

  return {
    ...swr,
  }
}

export default useAPI
