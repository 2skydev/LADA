import logoImage from '~/assets/images/logo@256.png';

import useLeagueVersion from './useLeagueVersion';

const useDataDragonAsset = (type: string, asset: string | number) => {
  const version = useLeagueVersion();

  return version
    ? `https://ddragon.leagueoflegends.com/cdn/${version}/img/${type}/${asset}.png`
    : logoImage;
};

export default useDataDragonAsset;
