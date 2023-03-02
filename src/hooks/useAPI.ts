import { useEffect, useState } from 'react';

import { useRecoilValue } from 'recoil';
import useSWR, { SWRConfiguration, useSWRConfig } from 'swr';
import { serialize } from 'swr/_internal';

import { APICategory } from '@app/types/preload';

import { appStateStore } from '~/stores/app';

import { useDidUpdateEffect } from './useDidUpdateEffect';

export interface useAPIOptions extends SWRConfiguration {
  payload?: any;
  revalidateOnLeagueReconnect?: boolean;
}

const useAPI = <T = any>(category: APICategory, url: string, options: useAPIOptions = {}) => {
  const { payload, revalidateOnLeagueReconnect = false, ...swrOptions } = options;

  const [requestable, setRequestable] = useState(false);
  const { leagueIsReady } = useRecoilValue(appStateStore);
  const { cache } = useSWRConfig();

  let key: any = [category, url, payload];

  const cacheData = cache.get(serialize(key)[0])?.data;

  if (!requestable) key = null;
  if (category === 'league' && !leagueIsReady) key = null;

  const swr = useSWR<T>(key, {
    keepPreviousData: true,
    revalidateIfStale: true,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...(!requestable && { fallbackData: cacheData }),
    fetcher: async ([category, url, payload]: [APICategory, string, any]) => {
      console.log('fetcher', category, url, payload);
      return await window.electron.apis(category, url, payload);
    },
    ...swrOptions,
  });

  useEffect(() => {
    setTimeout(() => {
      setRequestable(true);
    }, 300);
  }, []);

  // FIXME: 동작은 하지만 원래 2번 요청 버그를 고쳤어야 했는데 requestable 작업 후 한번만 요청하게 됨 (이후에 다시 고쳐야 함)
  useDidUpdateEffect(() => {
    if (revalidateOnLeagueReconnect && leagueIsReady) swr.mutate();
  }, [leagueIsReady]);

  return {
    ...swr,
  };
};

export default useAPI;
