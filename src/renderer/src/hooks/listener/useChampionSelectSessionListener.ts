import { useEffect } from 'react'

import { useRecoilValue, useSetRecoilState } from 'recoil'

import { championSelectSessionStore } from '@renderer/stores/championSelectSession'
import { currentSummonerStore } from '@renderer/stores/currentSummoner'
import { leagueChampSelectLaneStringToLane } from '@renderer/utils/league'

const useChampionSelectSessionListener = () => {
  const currentSummoner = useRecoilValue(currentSummonerStore)
  const setChampionSelectSession = useSetRecoilState(championSelectSessionStore)

  useEffect(() => {
    window.electron.subscribeLeague('champ-select/session', data => {
      const currentSummonerId = currentSummoner!.id
      const currentSummonerData = data.myTeam.find(
        player => player.summonerId === currentSummonerId,
      )
      const currentLane = currentSummonerData?.assignedPosition || null
      const currentChampionId = currentSummonerData?.championId || null
      const currentTempChampionId = currentSummonerData?.championPickIntent || null

      setChampionSelectSession({
        gameId: data.gameId,
        lane: leagueChampSelectLaneStringToLane(currentLane),
        championId: currentChampionId,
        tempChampionId: currentTempChampionId,
      })

      console.log('champ-select/session', data, currentLane)
    })
  }, [])
}

export default useChampionSelectSessionListener
