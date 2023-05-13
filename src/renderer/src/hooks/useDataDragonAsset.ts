import axios from 'axios'
import useSWRImmutable from 'swr/immutable'

import logoImage from '@renderer/assets/images/logo@256.png'

const useDataDragonAsset = (type: string, asset: string | number) => {
  const { data: versions } = useSWRImmutable(
    'https://ddragon.leagueoflegends.com/api/versions.json',
    async url => {
      const { data } = await axios.get(url)
      return data
    },
  )

  const latestVersion = versions?.[0]

  return latestVersion
    ? `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/${type}/${asset}.png`
    : logoImage
}

export default useDataDragonAsset
