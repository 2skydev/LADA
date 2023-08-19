import type { ElectronContext } from 'src/preload/electron'
import useSWR, { SWRConfiguration } from 'swr'

export interface useAPIOptions<Args> extends SWRConfiguration {
  params?: Args
  disabled?: boolean
}

type ElectronContextPropertyName = keyof ElectronContext

const useAPI = <FnName extends ElectronContextPropertyName>(
  fnName: FnName,
  options: useAPIOptions<Parameters<ElectronContext[FnName]>> = {},
) => {
  const { params = [], disabled, ...swrOptions } = options

  const key = [fnName, params] as const

  const swr = useSWR<Awaited<ReturnType<ElectronContext[FnName]>>>(disabled ? null : key, {
    keepPreviousData: true,
    revalidateIfStale: true,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fetcher: async ([, args]: typeof key) => {
      console.log('useAPI', fnName, args)
      // @ts-ignore
      const response = await window.electron[fnName](...args)

      if (response?.errorCode) throw new Error(response?.message || 'Unknown Error')

      return response
    },
    ...swrOptions,
  })

  return swr
}

export default useAPI
