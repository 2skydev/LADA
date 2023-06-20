import { initializer, singleton } from '@launchtray/tsyringe-async'
import axios from 'axios'
import * as cheerio from 'cheerio'

import { getAvgTier } from '@main/modules/league/utils/rank'
import { PSInGame } from '@main/modules/ps/types/stat'
import { PSSummoner } from '@main/modules/ps/types/summoner'
import {
  convertPSInGameDataToTeamAdApRatio,
  convertPSInGameDataToTeamPlayers,
} from '@main/modules/ps/utils/convert'
import { getDivision } from '@main/modules/ps/utils/rank'
import IPCServer from '@main/utils/IPCServer'

@singleton()
export class PSModule {
  version: number
  server: IPCServer

  constructor() {
    this.server = new IPCServer('apis/ps')

    this.server.add('/tiers/:lane', async ({ params, payload }) => {
      const { lane } = params
      const { rankRangeId = 2 } = payload

      const {
        data: { data },
      } = await axios.get(`https://lol.ps/api/statistics/tierlist.json`, {
        params: {
          region: 0,
          version: this.version,
          tier: rankRangeId,
          lane: Number(lane),
        },
      })

      return data
    })

    this.server.add('/summoner-ps-id/:summonerName', async ({ params }) => {
      const { summonerName } = params

      const { data: html } = await axios.get(`https://lol.ps/summoner/${summonerName}`)
      const $ = cheerio.load(html)

      const [
        ,
        ,
        ,
        {
          data: { summary },
        },
      ] = JSON.parse($('script[sveltekit\\:data-type="server_data"]').text())

      return summary._id
    })

    this.server.add('/summoners', async ({ payload }) => {
      const { names = [] } = payload

      const promises = names.map((name: string) =>
        (async () => {
          const { data: html } = await axios.get(`https://lol.ps/summoner/${name}`)
          const $ = cheerio.load(html)

          const [
            ,
            ,
            ,
            {
              data: { summary },
            },
          ] = JSON.parse($('script[sveltekit\\:data-type="server_data"]').text())

          return summary
        })(),
      )

      return Promise.all(promises)
    })

    this.server.add('/in-game/:summonerPsId', async ({ params }) => {
      const { summonerPsId } = params
      return await this.getInGame(summonerPsId)
    })

    this.server.add('/duo/:duoId', async ({ params, payload }) => {
      const { duoId } = params
      const { rankRangeId = 2, criterion = 'synergyScore', order = 'desc', championId } = payload

      const {
        data: { data },
      } = await axios.get(`https://lol.ps/api/lab/duo-list.json`, {
        params: {
          region: 0,
          version: this.version,
          tier: rankRangeId,
          duo: duoId,
          criterion,
          order,
          ...(championId !== undefined && championId !== null && { championId }),
        },
      })

      return data.map((item, i) => ({ ...item, ranking: i + 1 }))
    })

    this.server.add('/champ/:id', async ({ params, payload }) => {
      const { id } = params
      let { laneId, rankRangeId = 2 } = payload

      // 선택한 라인이 없다면 챔피언의 기본 라인을 가져오기
      if (laneId === null || laneId === undefined) {
        const {
          data: { data: champArgs },
        } = await axios.get(`https://lol.ps/api/champ/${id}/arguments.json`)
        laneId = champArgs.laneId
      }

      laneId = Number(laneId)
      rankRangeId = Number(rankRangeId)

      const {
        data: { data: summary },
      } = await axios.get(`https://lol.ps/api/champ/${id}/summary.json`, {
        params: {
          region: 0,
          version: this.version,
          tier: rankRangeId,
          lane: laneId,
        },
      })

      const {
        data: {
          data: { itemWinrates: item, spellWinrates: spell },
        },
      } = await axios.get(`https://lol.ps/api/champ/${id}/spellitem.json`, {
        params: {
          region: 0,
          version: this.version,
          tier: rankRangeId,
          lane: laneId,
        },
      })

      const {
        data: { data: skill },
      } = await axios.get(`https://lol.ps/api/champ/${id}/skill.json`, {
        params: {
          region: 0,
          version: this.version,
          tier: rankRangeId,
          lane: laneId,
        },
      })

      const {
        data: { data: runestatperk },
      } = await axios.get(`https://lol.ps/api/champ/${id}/runestatperk.json`, {
        params: {
          region: 0,
          version: this.version,
          tier: rankRangeId,
          lane: laneId,
        },
      })

      const {
        data: {
          data: { timelineWinrates },
        },
      } = await axios.get(`https://lol.ps/api/champ/${id}/graphs.json`, {
        params: {
          region: 0,
          version: this.version,
          tier: rankRangeId,
          lane: laneId,
        },
      })

      const {
        data: { data: versus },
      } = await axios.get(`https://lol.ps/api/champ/${id}/versus.json`, {
        params: {
          region: 0,
          version: this.version,
          tier: rankRangeId,
          lane: laneId,
        },
      })

      const counterChampionIdList = JSON.parse(versus.counterChampionIdList)
      const counterWinrateList = JSON.parse(versus.counterWinrateList)

      interface CounterChampions {
        up: { champId: number; winrate: number }[]
        down: { champId: number; winrate: number }[]
      }

      const counterChampions: CounterChampions = counterChampionIdList.reduce(
        (acc: CounterChampions, champId: number, index: number) => {
          const winrate = counterWinrateList[index]

          acc[winrate > 50 ? 'up' : 'down'].push({ champId, winrate })

          return acc
        },
        { up: [], down: [] },
      )

      counterChampions.down.sort((a, b) => a.winrate - b.winrate)
      counterChampions.up.sort((a, b) => b.winrate - a.winrate)

      return { item, spell, skill, runestatperk, summary, timelineWinrates, counterChampions }
    })
  }

  @initializer()
  async init() {
    this.version = await this.getLatestVersion()
  }

  async getLatestVersion(): Promise<number> {
    const {
      data: {
        data: [latestVersion],
      },
    } = await axios.get('https://lol.ps/api/info/active-version.json')

    return latestVersion.versionId
  }

  async getSummoner(summonerName: string): Promise<PSSummoner | null> {
    try {
      const {
        data: { data },
      } = await axios.get(
        `https://lol.ps/api/summoner/${encodeURIComponent(summonerName)}/summary.json?region=kr`,
      )

      return {
        summonerId: data.account_id,
        summonerPsId: data._id,
        summonerName: data.summoner_name,
        summonerLevel: data.summoner_level,
        summonerProfileIconId: data.profile_icon_id,
        wins: data.wins,
        losses: data.losses,
        count: data.count,
        tier: data.tier,
        division: getDivision(data.tier, data.rank),
        lp: data.league_points,
      }
    } catch {
      return null
    }
  }

  async getInGame(summonerPsId: string): Promise<PSInGame | null> {
    try {
      // return inGameTempData as PSInGame

      const {
        data: { data },
      } = await axios.get(`https://lol.ps/api/summoner/${summonerPsId}/spectator.json`, {
        params: {
          region: 'kr',
        },
      })

      const result: Omit<PSInGame, 'avgRankInfo'> = {
        blue: {
          adApRatio: convertPSInGameDataToTeamAdApRatio('blue', data),
          players: convertPSInGameDataToTeamPlayers('blue', data),
        },
        red: {
          adApRatio: convertPSInGameDataToTeamAdApRatio('red', data),
          players: convertPSInGameDataToTeamPlayers('red', data),
        },
        myTeam: 'red',
        enemyTeam: 'blue',
        gameStartTime: data.gameStartTime,
      }

      // const promises = (['blue', 'red'] as const)
      //   .map(team => {
      //     return result[team].players.map(player => {
      //       return this.getSummoner(player.summonerName)
      //     })
      //   })
      //   .flat()

      // const summoners = await Promise.all(promises)

      // ;(['blue', 'red'] as const).forEach(team => {
      //   result[team].players.forEach((player, i) => {
      //     const { promotion } = summoners[i + (team === 'red' ? 5 : 0)]!

      //     console.log(promotion, i + (team === 'red' ? 5 : 0))
      //     if (promotion) player.promotion = promotion
      //   })
      // })

      if (result.blue.players.find(player => player.summonerPsId === summonerPsId)) {
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
}
