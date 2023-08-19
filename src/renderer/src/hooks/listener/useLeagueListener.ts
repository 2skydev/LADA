import { useEffect } from 'react'

import { useAtom, useSetAtom } from 'jotai'

import { currentSummonerAtom } from '@renderer/stores/atoms/currentSummoner.atom'
import { leagueAtom } from '@renderer/stores/atoms/league.atom'

const useLeagueListener = () => {
  const [league, setLeague] = useAtom(leagueAtom)
  const setCurrentSummoner = useSetAtom(currentSummonerAtom)

  useEffect(() => {
    window.electron.onChangeLeagueClientConnection(async status => {
      const isReady = status === 'connect'

      setLeague({
        ...league,
        isReady,
      })

      const summoner = await window.electron.getCurrentSummoner()
      setCurrentSummoner(summoner)
    })

    window.electron.onChangeIsInGame(isInGame => {
      setLeague({
        ...league,
        isInGame,
      })
    })
  }, [])
}

export default useLeagueListener
