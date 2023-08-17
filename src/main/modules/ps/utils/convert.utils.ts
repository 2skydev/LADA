import { Champions } from '@main/modules/league/types/champion.types'
import type { AdApRatio } from '@main/modules/league/types/stat.types'
import { SummonerSpells } from '@main/modules/league/types/summoner-spell.types'
import type { PSInGamePlayer } from '@main/modules/ps/types/stat.types'
import { getDivision } from '@main/modules/ps/utils/rank.utils'
import { getTagsByPSInGamePlayerData } from '@main/modules/ps/utils/stat.utils'

export const convertPSInGameDataToTeamAdApRatio = (
  team: 'red' | 'blue',
  spectatorData: any,
): AdApRatio => {
  return {
    ad: Number(spectatorData.adApRatio[team].ad),
    ap: Number(spectatorData.adApRatio[team].ap),
    true: Number(spectatorData.adApRatio[team].true),
  }
}

export const convertPSInGameDataToTeamPlayers = (
  team: 'red' | 'blue',
  spectatorData: any,
  additionalData: {
    summonerSpells: SummonerSpells
    champions: Champions
  },
): PSInGamePlayer[] => {
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
        participant.teamId === (team === 'blue' ? 100 : 200) && participant.laneId === findLaneId,
    )

    const { tier, rank, lp, psScore, seasonStat, championStat, matchResults, ganked, turrets } =
      spectatorData.participantInfo[summonerPsId]

    const division = getDivision(tier, rank)

    const result: PSInGamePlayer = {
      summonerName,
      summonerPsId,
      tier: tier ?? 'UNRANKED',
      division,
      lp: lp ?? 0,
      laneId,
      psScore,
      champion: additionalData.champions[championId],
      ganked,
      turrets,
      seasonStats: {
        winRate: seasonStat.winrate,
        gameCount: seasonStat.count,
      },
      championStats: {
        winRate: championStat.winrate,
        gameCount: championStat.count,
        kda: championStat.kda,
      },
      runes: {
        main: perks.perkIds.slice(0, 4),
        sub: perks.perkIds.slice(4, 6),
        shard: perks.perkIds.slice(6, 9),
      },
      spells: [additionalData.summonerSpells[spell1Id], additionalData.summonerSpells[spell2Id]],
      recentMatches: matchResults
        .map(matchResult => ({
          champion: additionalData.champions[matchResult.champion_id],
          isWin: Boolean(matchResult.win),
        }))
        .reverse(),
    }

    result.tags = getTagsByPSInGamePlayerData(result)

    return result
  })
}
