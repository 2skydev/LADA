import logoImage from '@renderer/assets/images/logo@256.png'
import useDataDragonVersion from '@renderer/hooks/useDataDragonVersion'

export type DataDragonAssetType =
  | 'champion'
  | 'champion/splash'
  | 'champion/loading'
  | 'item'
  | 'profileicon'
  | 'spell'
  | 'passive'
  | 'perk-images'

const useDataDragonAsset = (type: DataDragonAssetType, filename: any) => {
  const version = useDataDragonVersion()

  if (type === 'perk-images') {
    filename = String(filename).replace('perk-images/', '').replace('.png', '')
  }

  if (type === 'item') {
    filename = String(filename).replace('.png', '')
  }

  const versionPath = ['champion/loading', 'perk-images'].includes(type) ? '' : `/${version}`
  const extension = type === 'champion/loading' ? '.jpg' : '.png'

  return version
    ? `https://ddragon.leagueoflegends.com/cdn${versionPath}/img/${type}/${filename}${extension}`
    : logoImage
}

export default useDataDragonAsset
