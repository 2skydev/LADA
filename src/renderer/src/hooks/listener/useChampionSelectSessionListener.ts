import { useEffect } from 'react'

import deepEqual from 'fast-deep-equal'
import { useRecoilState, useRecoilValue } from 'recoil'

import { leagueChampSelectLaneStringToLaneId } from '@main/modules/league/utils/lane'

import { championSelectSessionStore } from '@renderer/stores/championSelectSession'
import { currentSummonerStore } from '@renderer/stores/currentSummoner'

const useChampionSelectSessionListener = () => {
  const currentSummoner = useRecoilValue(currentSummonerStore)
  const [championSelectSession, setChampionSelectSession] = useRecoilState(
    championSelectSessionStore,
  )

  useEffect(() => {
    window.electron.subscribeLeague('champ-select/session', data => {
      const currentSummonerId = currentSummoner!.id
      const currentSummonerData = data.myTeam.find(
        player => player.summonerId === currentSummonerId,
      )
      const currentLane = currentSummonerData?.assignedPosition || null
      const currentChampionId = currentSummonerData?.championId || null
      const currentTempChampionId = currentSummonerData?.championPickIntent || null

      const newChampionSelectSession = {
        gameId: data.gameId,
        laneId: leagueChampSelectLaneStringToLaneId(currentLane),
        championId: currentChampionId,
        tempChampionId: currentTempChampionId,
      }

      if (!deepEqual(newChampionSelectSession, championSelectSession)) {
        setChampionSelectSession(newChampionSelectSession)
      }
    })

    return () => {
      window.electron.unsubscribeLeague('champ-select/session')
    }
  }, [currentSummoner?.id, championSelectSession])
}

export default useChampionSelectSessionListener
