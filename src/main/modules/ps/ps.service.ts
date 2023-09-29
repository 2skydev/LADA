import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { omit } from 'lodash'

import { ExecuteLog } from '@main/decorators/execute-log.decorator'
import { ReturnValueCaching } from '@main/decorators/return-value-caching.decorator'
import { LeagueDataDragonProvider } from '@main/modules/league/league-data-dragon.provider'
import { ChampionStats, GetChampionStatsOptions } from '@main/modules/league/types/champion.types'
import { LaneId } from '@main/modules/league/types/lane.types'
import {
  CounterChampions,
  ItemBuild,
  ItemBuildGroup,
  RuneBuild,
} from '@main/modules/league/types/stat.types'
import { getAvgTier } from '@main/modules/league/utils/rank.utils'
import { DuoId, DuoSynergyList, GetDuoSynergyListOptions } from '@main/modules/ps/types/duo.types'
import { RankRangeId } from '@main/modules/ps/types/rank.types'
import { PSInGame } from '@main/modules/ps/types/stat.types'
import { PSSummonerStats } from '@main/modules/ps/types/summoner.types'
import {
  convertPSInGameDataToTeamAdApRatio,
  convertPSInGameDataToTeamPlayers,
} from '@main/modules/ps/utils/convert.utils'
import { getDivision } from '@main/modules/ps/utils/rank.utils'
import { ChampionTierItem } from '@main/modules/stats-provider-integration/types/champion.types'

@Injectable()
export class PSService {
  constructor(private readonly leagueDataDragonProvider: LeagueDataDragonProvider) {}

  private async fetch(url: string, params?: Record<string, any>) {
    const version = await this.getLatestVersion()

    return axios.get(url, {
      baseURL: 'https://lol.ps/api',
      params: {
        version,
        region: 0,
        ...params,
      },
    })
  }

  @ReturnValueCaching()
  @ExecuteLog()
  async getLatestVersion(): Promise<number> {
    const {
      data: {
        data: [latestVersion],
      },
    } = await axios.get('https://lol.ps/api/info/active-version.json')

    return latestVersion.versionId
  }

  public async getChampionTierList(
    laneId: LaneId,
    rankRangeId: RankRangeId = 2,
  ): Promise<ChampionTierItem[]> {
    const champions = await this.leagueDataDragonProvider.getChampions()

    const {
      data: { data },
    } = await this.fetch(`/statistics/tierlist.json`, {
      tier: rankRangeId,
      lane: laneId,
    })

    return data.map(item => ({
      champion: champions[item.championId],
      rankingVariation: +item.rankingVariation,
      ranking: +item.ranking,
      tier: +item.opTier,
      isHoney: item.isHoney,
      isOp: item.isOp,
      opScore: +item.opScore,
      honeyScore: +item.honeyScore,
      winRate: +item.winRate,
      pickRate: +item.pickRate,
      banRate: +item.banRate,
      count: +item.count,
      updatedAt: item.updatedAt,
    }))
  }

  public async getSummonerStatsByName(summonerName: string): Promise<PSSummonerStats | null> {
    try {
      const {
        data: { data },
      } = await axios.get(
        `https://lol.ps/api/summoner/${encodeURIComponent(summonerName)}/summary.json?region=kr`,
      )

      return {
        id: data.account_id,
        psId: data._id,
        name: data.summoner_name,
        level: data.summoner_level,
        profileIcon: this.leagueDataDragonProvider.getImageUrl('profileicon', data.profile_icon_id),
        wins: data.wins,
        losses: data.losses,
        count: data.count,
        tier: data.tier ?? 'UNRANKED',
        division: getDivision(data.tier, data.rank),
        lp: data.league_points ?? 0,
      }
    } catch {
      return null
    }
  }

  public async getInGameByName(summonerName: string): Promise<PSInGame | null> {
    try {
      const summonerStats = await this.getSummonerStatsByName(summonerName)
      if (!summonerStats) throw new Error('소환사 정보를 가져올 수 없습니다.')

      const champions = await this.leagueDataDragonProvider.getChampions()
      const summonerSpells = await this.leagueDataDragonProvider.getSummonerSpells()

      const {
        data: { data },
      } = await axios.get(`https://lol.ps/api/summoner/${summonerStats.psId}/spectator.json`, {
        params: {
          region: 'kr',
        },
      })

      const result: Omit<PSInGame, 'avgRankInfo'> = {
        blue: {
          adApRatio: convertPSInGameDataToTeamAdApRatio('blue', data),
          players: convertPSInGameDataToTeamPlayers('blue', data, { summonerSpells, champions }),
        },
        red: {
          adApRatio: convertPSInGameDataToTeamAdApRatio('red', data),
          players: convertPSInGameDataToTeamPlayers('red', data, { summonerSpells, champions }),
        },
        myTeam: 'red',
        enemyTeam: 'blue',
        gameStartTime: data.gameStartTime,
      }

      if (result.blue.players.find(player => player.summonerPsId === summonerStats.psId)) {
        result.myTeam = 'blue'
        result.enemyTeam = 'red'
      }

      const avgRankInfo = getAvgTier([
        ...result.blue.players.map(({ tier, division, lp }) => ({ tier, division, lp })),
        ...result.red.players.map(({ tier, division, lp }) => ({ tier, division, lp })),
      ])

      return {
        ...result,
        avgRankInfo,
      }
    } catch {
      return null
    }
  }

  public async getDuoSynergyList(
    duoId: DuoId,
    options?: GetDuoSynergyListOptions,
  ): Promise<DuoSynergyList> {
    const {
      championId,
      rankRangeId = 2,
      criterion = 'synergyScore',
      order = 'desc',
    } = options || {}

    const champions = await this.leagueDataDragonProvider.getChampions()

    const {
      data: { data },
    } = await this.fetch(`https://lol.ps/api/lab/duo-list.json`, {
      tier: rankRangeId,
      duo: duoId,
      criterion,
      order,
      ...(championId !== undefined && championId !== null && { championId }),
    })

    return data.map((item, i) => ({
      ranking: i + 1,
      champion1: {
        ...champions[item.championId1],
        winrate: +item.winrate1,
      },
      champion2: {
        ...champions[item.championId2],
        winrate: +item.winrate2,
      },
      synergyScore: +item.synergyScore,
      duoWinrate: +item.duoWinrate,
      pickrate: +item.pickrate,
      count: +item.count,
    }))
  }

  public async getChampionStats(
    championId: number,
    options?: GetChampionStatsOptions,
  ): Promise<ChampionStats> {
    let { laneId, rankRangeId = 2 } = options || {}

    // 선택한 라인이 없다면 챔피언의 기본 라인을 가져오기
    if (laneId === null || laneId === undefined) {
      const {
        data: { data: champArgs },
      } = await axios.get(`https://lol.ps/api/champ/${championId}/arguments.json`)

      laneId = Number(champArgs.laneId) as LaneId
    }

    const fetchParams = {
      tier: rankRangeId,
      lane: laneId,
    }

    let promises = [
      this.leagueDataDragonProvider.getChampions(),
      this.leagueDataDragonProvider.getGameItemData(),
      this.leagueDataDragonProvider.getSummonerSpells(),

      this.fetch(`https://lol.ps/api/champ/${championId}/summary.json`, fetchParams),
      this.fetch(`https://lol.ps/api/champ/${championId}/spellitem.json`, fetchParams),
      this.fetch(`https://lol.ps/api/champ/${championId}/runestatperk.json`, fetchParams),
      this.fetch(`https://lol.ps/api/champ/${championId}/versus.json`, fetchParams),
    ] as const

    const [
      champions,
      { gameItems, mythicalLevelItemIds },
      summonerSpells,
      {
        data: {
          data: [psSummary],
        },
      },
      {
        data: {
          data: { itemWinrates: psItemStats },
        },
      },
      {
        data: { data: psRuneStats },
      },
      {
        data: { data: versus },
      },
    ] = await Promise.all(promises)

    const counterChampionIdList = JSON.parse(versus.counterChampionIdList)
    const counterWinrateList = JSON.parse(versus.counterWinrateList)

    const counterChampions: CounterChampions = counterChampionIdList.reduce(
      (acc: CounterChampions, counterChampionId: number, index: number) => {
        const winRate = counterWinrateList[index]

        acc[winRate > 50 ? 'up' : 'down'].push({ champion: champions[counterChampionId], winRate })

        return acc
      },
      { up: [], down: [] },
    )

    counterChampions.down.sort((a, b) => a.winRate - b.winRate)
    counterChampions.up.sort((a, b) => b.winRate - a.winRate)

    const mainShardRuneIds: [number, number, number] = [
      psSummary.statperk1Id,
      psSummary.statperk2Id,
      psSummary.statperk3Id,
    ]

    const runeBuilds: RuneBuild[] = psRuneStats.runeWinrates.total.reduce((acc, item) => {
      acc.push({
        mainRuneIds: item.category1RuneIdList,
        subRuneIds: item.category2RuneIdList,
        shardRuneIds: mainShardRuneIds,
        winRate: item.winRate,
        pickRate: item.pickRate,
        count: item.count,
      })

      return acc
    }, [])

    const psItemBuilds: {
      winRate: number
      pickRate: number
      count: number
      itemIds: number[]
    }[] = [
      ...psItemStats.till2,
      ...psItemStats.till3,
      ...psItemStats.till4,
      ...psItemStats.till5,
    ].map(itemBuildItem => ({
      winRate: +itemBuildItem.winRate,
      pickRate: +itemBuildItem.pickRate,
      count: itemBuildItem.count,
      itemIds: itemBuildItem.itemIdList.map(itemId => +itemId),
    }))

    const tempGroupObj: Record<string, Omit<ItemBuildGroup, 'children'>> = {}

    psItemBuilds.forEach(psItemBuild => {
      let mainItemId = psItemBuild.itemIds.find(itemId => mythicalLevelItemIds.includes(itemId))
      let isMythicalLevel = true

      if (!mainItemId) {
        mainItemId = psItemBuild.itemIds[0]
        isMythicalLevel = false
      }

      const groupItem = (tempGroupObj[mainItemId] ||= {
        mainItem: gameItems[mainItemId],
        pickRate: 0,
        winRate: 0,
        count: 0,
        length: 0,
        isMythicalLevel,
      })

      groupItem.pickRate += Number(psItemBuild.pickRate)
      groupItem.winRate += Number(psItemBuild.winRate)
      groupItem.count += psItemBuild.count
      groupItem.length++
    })

    const itemBuildGroups: ItemBuildGroup[] = Object.values(tempGroupObj).map(group => {
      const children = psItemBuilds.reduce<ItemBuild[]>((acc, psItemBuild) => {
        if (psItemBuild.itemIds.some(itemId => itemId === group.mainItem.id)) {
          acc.push({
            ...omit(psItemBuild, ['itemIds']),
            items: psItemBuild.itemIds.map(itemId => gameItems[itemId]),
          })
        }

        return acc
      }, [])

      return {
        ...group,
        pickRate: Number((group.pickRate / group.length).toFixed(1)),
        winRate: Number((group.winRate / group.length).toFixed(1)),
        children,
      }
    })

    itemBuildGroups.sort((a, b) => b.count - a.count)

    const summary: ChampionStats['summary'] = {
      isOp: psSummary.isOp,
      isHoney: psSummary.isHoney,
      winRate: +psSummary.winRate,
      count: psSummary.count,
      skillLv15List: psSummary.skillLv15List,
      skillMasterList: psSummary.skillMasterList,
      spells: [summonerSpells[psSummary.spell2Id], summonerSpells[psSummary.spell1Id]],
      laneId: psSummary.laneId,
      tier: psSummary.psTier,
      runeBuild: {
        mainRuneIds: psSummary.category1RuneIdList,
        subRuneIds: psSummary.category2RuneIdList,
        shardRuneIds: mainShardRuneIds,
      },
      startingItemList: psSummary.startingItemIdList
        .map(itemIds => itemIds.map(itemId => gameItems[itemId]))
        .flat(),
      shoesItemList: psSummary.shoesId ? [gameItems[psSummary.shoesId]] : [],
      coreItemList: psSummary.coreItemIdList.map(itemId => gameItems[itemId]),
    }

    return {
      summary,
      champion: champions[championId],
      counterChampions,
      runeBuilds,
      itemBuildGroups,
    }
  }
}
