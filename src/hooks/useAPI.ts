import { useEffect } from 'react';

import { useRecoilValue } from 'recoil';
import useSWR, { SWRConfiguration } from 'swr';

import { APICategory } from '@app/types/preload';

import { appStateStore } from '~/stores/app';

import { useDidUpdateEffect } from './useDidUpdateEffect';

export interface useAPIOptions extends SWRConfiguration {
  payload?: any;
  revalidateOnLeagueReconnect?: boolean;
}

const useAPI = <T = any>(category: APICategory, url: string, options: useAPIOptions = {}) => {
  const { leagueIsReady } = useRecoilValue(appStateStore);
  const { payload, revalidateOnLeagueReconnect = false, ...swrOptions } = options;

  const swr = useSWR<T>(category !== 'league' || leagueIsReady ? [category, url, payload] : null, {
    keepPreviousData: true,
    revalidateIfStale: true,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fetcher: async ([category, url, payload]: [APICategory, string, any]) => {
      console.log('fetcher', category, url, payload);
      return await window.electron.apis(category, url, payload);
    },
    ...swrOptions,
  });

  useDidUpdateEffect(() => {
    console.log('revalidateOnLeagueReconnect', leagueIsReady);
    if (revalidateOnLeagueReconnect && leagueIsReady) swr.mutate();
  }, [leagueIsReady]);

  return swr;
};

export default useAPI;
