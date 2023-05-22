import axios from 'axios'
import useSWRImmutable from 'swr/immutable'

import useDataDragonVersion from '@renderer/hooks/useDataDragonVersion'

export interface DataDragonItem {
  id: string
  name: string
  image: string
  isMythicalLevel: boolean
}

export type DataDragonItems = Record<string, DataDragonItem>

export interface DataDragonItemsReturnValue {
  items: DataDragonItems
  mythicalLevelItemIds: string[]
}

export const FORCE_MYTHICAL_LEVEL_ITEM_NAME_WORDS = ['구인수']

const useDataDragonItems = (): DataDragonItemsReturnValue | null => {
  const version = useDataDragonVersion()

  const { data } = useSWRImmutable(
    version ? `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/item.json` : null,
    async url => {
      const { data } = await axios.get(url)

      const allItems: DataDragonItems = {}

      for (const itemId in data.data) {
        const item = data.data[itemId]

        if (!item.gold.purchasable) continue

        allItems[itemId] = {
          id: itemId,
          name: item.name,
          image: String(item.image.full),
          isMythicalLevel:
            item.description.includes('신화급 기본 지속 효과') ||
            FORCE_MYTHICAL_LEVEL_ITEM_NAME_WORDS.some(word => item.name.includes(word)),
        }
      }

      return {
        items: allItems,
        mythicalLevelItemIds: Object.values(allItems)
          .filter(item => item.isMythicalLevel)
          .map(item => item.id),
      }
    },
  )

  return data || null
}

export default useDataDragonItems
