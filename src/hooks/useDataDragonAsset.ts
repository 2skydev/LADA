import logoImage from '~/assets/images/logo@256.png';

import useLeagueVersion from './useLeagueVersion';

export type DataDragonAssetType =
  | 'champion'
  | 'champion/splash'
  | 'champion/loading'
  | 'item'
  | 'profileicon'
  | 'spell'
  | 'passive';

const useDataDragonAsset = (type: DataDragonAssetType, filename: string | number) => {
  const version = useLeagueVersion();

  const versionPath = type === 'champion/loading' ? '' : `/${version}`;
  const extension = type === 'champion/loading' ? '.jpg' : '.png';

  return version
    ? `https://ddragon.leagueoflegends.com/cdn${versionPath}/img/${type}/${filename}${extension}`
    : logoImage;
};

export default useDataDragonAsset;
