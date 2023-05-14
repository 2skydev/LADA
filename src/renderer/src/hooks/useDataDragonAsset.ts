import logoImage from '@renderer/assets/images/logo@256.png'

import useLeagueVersion from './useLeagueVersion'

export type DataDragonAssetType =
  | 'champion'
  | 'champion/splash'
  | 'champion/loading'
  | 'item'
  | 'profileicon'
  | 'spell'
  | 'passive'
  | 'perk-images'

const useDataDragonAsset = (type: DataDragonAssetType, filename: string | number) => {
  const version = useLeagueVersion()

  if (type === 'perk-images') {
    filename = (filename as string).replace('perk-images/', '').replace('.png', '')
  }

  const versionPath = ['champion/loading', 'perk-images'].includes(type) ? '' : `/${version}`
  const extension = type === 'champion/loading' ? '.jpg' : '.png'

  return version
    ? `https://ddragon.leagueoflegends.com/cdn${versionPath}/img/${type}/${filename}${extension}`
    : logoImage
}

export default useDataDragonAsset
