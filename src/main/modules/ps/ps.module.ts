import { initializer, singleton } from '@launchtray/tsyringe-async'
import axios from 'axios'
import * as cheerio from 'cheerio'

import { DIVISION_ROMAN_TO_NUMBER_MAP } from '@main/modules/league/constants/rank'
import { AdApRatio } from '@main/modules/league/types/stat'
import { getAvgTier } from '@main/modules/league/utils/rank'
import { PSVersion } from '@main/modules/ps/types'
import { PSInGame, PSInGamePlayer } from '@main/modules/ps/types/stat'
import IPCServer from '@main/utils/IPCServer'

const getLatestVersion = async (): Promise<PSVersion> => {
  const { data: html } = await axios.get('https://lol.ps/statistics')
  const $ = cheerio.load(html)

  const [
    ,
    ,
    ,
    {
      data: {
        versionInfo: [latestVersion],
      },
    },
  ] = JSON.parse($('script[sveltekit\\:data-type="server_data"]').text())

  return {
    id: latestVersion.versionId,
    label: latestVersion.description,
    date: latestVersion.patchDate,
  }
}

@singleton()
export class PSModule {
  version: PSVersion
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
          version: this.version.id,
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

      try {
        const {
          data: { data },
        } = await axios.get(`https://lol.ps/api/summoner/${summonerPsId}/spectator.json`, {
          params: {
            region: 'kr',
          },
        })

        const getTeamAdApRatio = (team: 'red' | 'blue', spectatorData: any): AdApRatio => {
          return {
            ad: Number(spectatorData.adApRatio[team].ad),
            ap: Number(spectatorData.adApRatio[team].ap),
            true: Number(spectatorData.adApRatio[team].true),
          }
        }

        const getTeamPlayers = (team: 'red' | 'blue', spectatorData: any): PSInGamePlayer[] => {
          return [0, 1, 2, 3, 4].map(findLaneId => {
            const {
              summonerName,
              summonerId: summonerPsId,
              championId,
              spell1Id,
              spell2Id,
              perks,
              laneId,
            } = spectatorData.participants.find(
              participant =>
                participant.teamId === (team === 'blue' ? 100 : 200) &&
                participant.laneId === findLaneId,
            )

            const { tier, rank, lp, psScore, seasonStat, championStat } =
              spectatorData.participantInfo[summonerPsId]

            const division = ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(tier)
              ? null
              : DIVISION_ROMAN_TO_NUMBER_MAP[rank]

            return {
              summonerName,
              summonerPsId,
              tier,
              division,
              lp,
              laneId,
              psScore,
              championId,
              seasonStat: {
                winRate: seasonStat.winrate,
                gameCount: seasonStat.count,
              },
              championStat: {
                winRate: championStat.winrate,
                gameCount: championStat.count,
                kda: championStat.kda,
              },
              runes: {
                main: perks.perkIds.slice(0, 4),
                sub: perks.perkIds.slice(4, 6),
                shard: perks.perkIds.slice(6, 9),
              },
              spellIds: [spell1Id, spell2Id],
            }
          })
        }

        const result: Omit<PSInGame, 'avgRankInfo'> = {
          blue: {
            adApRatio: getTeamAdApRatio('blue', data),
            players: getTeamPlayers('blue', data),
          },
          red: {
            adApRatio: getTeamAdApRatio('red', data),
            players: getTeamPlayers('red', data),
          },
          myTeam: 'red',
          enemyTeam: 'blue',
          gameStartTime: data.gameStartTime,
        }

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
    })

    this.server.add('/duo/:duoId', async ({ params, payload }) => {
      const { duoId } = params
      const { rankRangeId = 2, criterion = 'synergyScore', order = 'desc', championId } = payload

      const {
        data: { data },
      } = await axios.get(`https://lol.ps/api/lab/duo-list.json`, {
        params: {
          region: 0,
          version: this.version.id,
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
          version: this.version.id,
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
          version: this.version.id,
          tier: rankRangeId,
          lane: laneId,
        },
      })

      const {
        data: { data: skill },
      } = await axios.get(`https://lol.ps/api/champ/${id}/skill.json`, {
        params: {
          region: 0,
          version: this.version.id,
          tier: rankRangeId,
          lane: laneId,
        },
      })

      const {
        data: { data: runestatperk },
      } = await axios.get(`https://lol.ps/api/champ/${id}/runestatperk.json`, {
        params: {
          region: 0,
          version: this.version.id,
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
          version: this.version.id,
          tier: rankRangeId,
          lane: laneId,
        },
      })

      const {
        data: { data: versus },
      } = await axios.get(`https://lol.ps/api/champ/${id}/versus.json`, {
        params: {
          region: 0,
          version: this.version.id,
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
    this.version = await getLatestVersion()
  }
}
