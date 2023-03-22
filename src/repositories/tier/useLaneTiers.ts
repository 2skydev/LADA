import useAPI from '~/hooks/useAPI';

import { ChampionStats } from './types';

export const useLaneTiers = (lane: number) => {
  const { data = [], isLoading } = useAPI<ChampionStats[]>('ps', `/tiers/${lane}`, {
    dedupingInterval: 1000 * 60 * 5,
  });

  return {
    data,
    isLoading,
  };
};
