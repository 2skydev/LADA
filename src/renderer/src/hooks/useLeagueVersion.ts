import axios from 'axios';
import useSWRImmutable from 'swr/immutable';

const useLeagueVersion = () => {
  const { data: versions } = useSWRImmutable(
    'https://ddragon.leagueoflegends.com/api/versions.json',
    async url => {
      const { data } = await axios.get(url);
      return data;
    },
  );

  return versions?.[0] || null;
};

export default useLeagueVersion;
