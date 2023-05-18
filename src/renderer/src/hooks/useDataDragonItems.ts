import axios from 'axios'
import useSWRImmutable from 'swr/immutable'

import useDataDragonVersion from '@renderer/hooks/useDataDragonVersion'

export interface DataDragonItem {
  name: string
  image: string
  isMythicalLevel: boolean
}

export type DataDragonItems = Record<string, DataDragonItem>

const useDataDragonItems = (): DataDragonItems | null => {
  const version = useDataDragonVersion()

  const { data } = useSWRImmutable(
    version ? `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/item.json` : null,
    async url => {
      const { data } = await axios.get(url)

      const result: DataDragonItems = {}

      for (const itemId in data.data) {
        const item = data.data[itemId]

        if (!item.gold.purchasable) continue

        result[itemId] = {
          name: item.name,
          image: String(item.image.full),
          isMythicalLevel: item.description.includes('신화급 기본 지속 효과'),
        }
      }

      return result
    },
  )

  return data || null
}

export default useDataDragonItems
