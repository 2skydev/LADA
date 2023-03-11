import axios from 'axios';
import useSWRImmutable from 'swr/immutable';

import useLeagueVersion from './useLeagueVersion';

const useChampNames = (): null | Record<string, { en: string; ko: string }> => {
  const version = useLeagueVersion();

  const { data } = useSWRImmutable(
    version ? `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json` : null,
    async url => {
      const { data } = await axios.get(url);
      return data;
    },
  );

  if (!data) return null;

  return Object.values(data.data).reduce((acc: Record<string, any>, champ: any) => {
    return {
      ...acc,
      [champ.key]: { en: champ.id, ko: champ.name },
    };
  }, {});
};

export default useChampNames;
