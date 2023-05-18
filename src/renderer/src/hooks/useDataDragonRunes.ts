import axios from 'axios'
import useSWRImmutable from 'swr/immutable'

import useDataDragonVersion from '@renderer/hooks/useDataDragonVersion'

export interface Rune {
  id: number
  icon: string
  name: string
  key: string
}

export interface RuneCategory {
  id: number
  icon: string
  name: string
  slots: Rune[][]
  runes: Record<number, Rune>
  key: string
}

export type RuneCategories = Record<number, RuneCategory>
export type RuneCategoryFindMap = Record<number, number>
export type RuneIcons = Record<number, string>

const ShardRunes: Rune[] = [
  {
    id: 5001,
    icon: 'perk-images/StatMods/StatModsHealthScalingIcon.png',
    name: '체력 증가',
    key: 'HealthScaling',
  },
  {
    id: 5002,
    icon: 'perk-images/StatMods/StatModsArmorIcon.png',
    name: '방어력',
    key: 'Armor',
  },
  {
    id: 5003,
    icon: 'perk-images/StatMods/StatModsMagicResIcon.MagicResist_Fix.png',
    name: '마법 저항력',
    key: 'MagicRes',
  },
  {
    id: 5005,
    icon: 'perk-images/StatMods/StatModsAttackSpeedIcon.png',
    name: '공격 속도',
    key: 'AttackSpeed',
  },
  {
    id: 5007,
    icon: 'perk-images/StatMods/StatModsCDRScalingIcon.png',
    name: '스킬 가속',
    key: 'CDRScaling',
  },
  {
    id: 5008,
    icon: 'perk-images/StatMods/StatModsAdaptiveForceIcon.png',
    name: '적응형 능력치',
    key: 'AdaptiveForce',
  },
]

const useDataDragonRunes = () => {
  const version = useDataDragonVersion()

  const { data } = useSWRImmutable(
    version
      ? `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/runesReforged.json`
      : null,
    async url => {
      const { data } = await axios.get(url)
      if (!data) return null

      const categories: RuneCategories = data.reduce(
        (acc: RuneCategories, item: any) => {
          const category: RuneCategory = {
            id: item.id,
            icon: item.icon,
            name: item.name,
            key: item.key,
            slots: item.slots.map(({ runes }: any) => runes),
            runes: {},
          }

          category.slots.forEach((runes: any) => {
            runes.forEach((rune: any) => {
              category.runes[rune.id] = {
                id: rune.id,
                icon: rune.icon,
                name: rune.name,
                key: rune.key,
              }
            })
          })

          acc[category.id] = category

          return acc
        },
        {
          5000: {
            id: 5000,
            icon: '',
            name: '파편',
            key: 'Shard',
            runes: ShardRunes,
            slots: [
              [ShardRunes[5], ShardRunes[3], ShardRunes[4]],
              [ShardRunes[5], ShardRunes[1], ShardRunes[2]],
              [ShardRunes[0], ShardRunes[1], ShardRunes[2]],
            ],
          },
        },
      )

      const icons: RuneIcons = Object.values(categories).reduce((acc: RuneIcons, category) => {
        acc[category.id] = category.icon

        Object.values(category.runes).forEach(rune => {
          acc[rune.id] = rune.icon
        })

        return acc
      }, {})

      const categoryFindMap: RuneCategoryFindMap = Object.values(categories).reduce(
        (acc: RuneCategoryFindMap, category) => {
          acc[category.id] = category.id

          Object.values(category.runes).forEach(rune => {
            acc[rune.id] = category.id
          })

          return acc
        },
        {},
      )

      return {
        icons,
        categories,
        categoryFindMap,
      }
    },
  )

  return data
}

export default useDataDragonRunes
