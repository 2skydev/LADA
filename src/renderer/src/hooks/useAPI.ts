import { useRecoilValue } from 'recoil'
import useSWR, { SWRConfiguration } from 'swr'

import { appStateStore } from '@renderer/stores/app'

import { useDidUpdateEffect } from './useDidUpdateEffect'

export interface useAPIOptions extends SWRConfiguration {
  payload?: any
  revalidateOnLeagueReconnect?: boolean
}

type APICategory = 'league' | 'ps'

const useAPI = <T = any>(category: APICategory, url: string, options: useAPIOptions = {}) => {
  const { payload, revalidateOnLeagueReconnect = false, ...swrOptions } = options

  const { leagueIsReady } = useRecoilValue(appStateStore)

  let key: any = [category, url, payload]

  if (category === 'league' && !leagueIsReady) key = null

  const swr = useSWR<T>(key, {
    keepPreviousData: true,
    revalidateIfStale: true,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fetcher: async ([category, url, payload]: [APICategory, string, any]) => {
      console.log('API 요청', category, url, payload)
      const response = await window.electron.apis(category, url, payload)

      if (response?.errorCode) throw new Error(response?.message || 'Unknown Error')

      return response
    },
    ...swrOptions,
  })

  useDidUpdateEffect(() => {
    if (revalidateOnLeagueReconnect && leagueIsReady) swr.mutate()
  }, [leagueIsReady])

  return {
    ...swr,
  }
}

export default useAPI
