import { Injectable, OnModuleInit } from '@nestjs/common'
import axios from 'axios'

import { ExecuteLog } from '@main/decorators/execute-log.decorator'
import { ReturnValueCaching } from '@main/decorators/return-value-caching.decorator'
import { ConfigService } from '@main/modules/config/config.service'
import {
  FORCE_MYTHICAL_LEVEL_ITEM_NAME_WORDS,
  SHARD_RUNES,
} from '@main/modules/league/league.constants'
import type { ChampionNames, Champions } from '@main/modules/league/types/champion.types'
import type { GameItemData, GameItems } from '@main/modules/league/types/item.types'
import type {
  RuneCategories,
  RuneCategory,
  RuneCategoryFindMap,
  RuneData,
  RuneIcons,
} from '@main/modules/league/types/rune.types'
import { SummonerSpells } from '@main/modules/league/types/summoner-spell.types'

export type DataDragonImageAssetType =
  | 'champion'
  | 'champion/splash'
  | 'champion/loading'
  | 'item'
  | 'profileicon'
  | 'spell'
  | 'passive'
  | 'perk-images'

@Injectable()
export class LeagueDataDragonProvider implements OnModuleInit {
  public version: string
  public language = 'en_US'
  public languages: string[]

  constructor(private readonly configService: ConfigService) {}

  private fetch(filename: string) {
    return axios.get(
      `https://ddragon.leagueoflegends.com/cdn/${this.version}/data/${this.language}/${filename}`,
    )
  }

  @ExecuteLog()
  public async onModuleInit() {
    const [{ data: versions }, { data: languages }] = await Promise.all([
      axios.get(`https://ddragon.leagueoflegends.com/api/versions.json`),
      axios.get(`https://ddragon.leagueoflegends.com/cdn/languages.json`),
    ])

    const configLanguage = this.configService.get('general.language')

    if (configLanguage && languages.includes(configLanguage)) {
      this.language = configLanguage
    }

    this.languages = languages
    this.version = versions[0]
  }

  @ReturnValueCaching()
  public async getChampionNames(): Promise<ChampionNames> {
    const { data } = await this.fetch('champion.json')

    return Object.values(data.data).reduce((acc: Record<string, any>, champ: any) => {
      return {
        ...acc,
        [champ.key]: { en: champ.id, ko: champ.name, image: champ.image.full },
      }
    }, {})
  }

  @ReturnValueCaching()
  public async getChampions(): Promise<Champions> {
    const { data } = await this.fetch('championFull.json')

    const SKILL_ID_ARRAY = ['Q', 'W', 'E', 'R']

    return Object.values(data.data).reduce((acc: Champions, item: any) => {
      return {
        ...acc,
        [+item.key]: {
          id: +item.key,
          name: item.name,
          imageFormats: {
            small: this.getImageUrl('champion', item.image.full),
            loading: this.getImageUrl('champion/loading', `${item.id}_0`),
            splash: this.getImageUrl('champion/splash', `${item.id}_0`),
          },
          skills: item.spells.reduce(
            (acc, spell, i) => ({
              ...acc,
              [SKILL_ID_ARRAY[i]]: {
                id: SKILL_ID_ARRAY[i],
                image: this.getImageUrl('spell', spell.image.full),
              },
            }),
            {},
          ),
        },
      }
    }, {})
  }

  @ReturnValueCaching()
  public async getGameItemData(): Promise<GameItemData> {
    const { data } = await this.fetch('item.json')

    const gameItems: GameItems = {}

    for (const itemId in data.data) {
      const item = data.data[itemId]

      if (!item.gold.purchasable) continue

      gameItems[+itemId] = {
        id: +itemId,
        name: item.name,
        image: this.getImageUrl('item', item.image.full),
        isMythicalLevel:
          item.description.includes('신화급 기본 지속 효과') ||
          FORCE_MYTHICAL_LEVEL_ITEM_NAME_WORDS.some(word => item.name.includes(word)),
      }
    }

    return {
      gameItems,
      mythicalLevelItemIds: Object.values(gameItems)
        .filter(item => item.isMythicalLevel)
        .map(item => item.id),
    }
  }

  @ReturnValueCaching()
  public async getRuneData(): Promise<RuneData> {
    const { data } = await this.fetch('runesReforged.json')

    const shardRunes = SHARD_RUNES.map(rune => ({
      ...rune,
      icon: this.getImageUrl('perk-images', rune.icon),
    }))

    const categories: RuneCategories = data.reduce(
      (acc: RuneCategories, item: any) => {
        const category: RuneCategory = {
          id: item.id,
          icon: this.getImageUrl('perk-images', item.icon),
          name: item.name,
          key: item.key,
          slots: item.slots.map(({ runes }: any) => runes),
          runes: {},
        }

        category.slots.forEach((runes: any) => {
          runes.forEach((rune: any) => {
            category.runes[rune.id] = {
              id: rune.id,
              icon: this.getImageUrl('perk-images', rune.icon),
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
          runes: shardRunes,
          slots: [
            [shardRunes[5], shardRunes[3], shardRunes[4]],
            [shardRunes[5], shardRunes[1], shardRunes[2]],
            [shardRunes[0], shardRunes[1], shardRunes[2]],
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
  }

  @ReturnValueCaching()
  public async getSummonerSpells(): Promise<SummonerSpells> {
    const { data } = await this.fetch('summoner.json')

    return Object.values(data.data).reduce((acc: Record<string, any>, spell: any) => {
      return {
        ...acc,
        [+spell.key]: {
          id: +spell.key,
          name: spell.name,
          image: this.getImageUrl('spell', spell.image.full),
        },
      }
    }, {})
  }

  public getImageUrl(type: DataDragonImageAssetType, filename: any) {
    filename = String(filename).replace(/\.(png|jpg)/g, '')

    if (type === 'perk-images') {
      filename = String(filename).replace('perk-images/', '')
    }

    const versionPath = ['champion/loading', 'champion/splash', 'perk-images'].includes(type)
      ? ''
      : `/${this.version}`
    const extension = ['champion/loading', 'champion/splash'].includes(type) ? '.jpg' : '.png'

    return `https://ddragon.leagueoflegends.com/cdn${versionPath}/img/${type}/${filename}${extension}`
  }
}
