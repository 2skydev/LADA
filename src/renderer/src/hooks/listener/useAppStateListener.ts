import { useEffect } from 'react'

import { useAtom, useSetAtom } from 'jotai'

import {
  currentSummonerAtom,
  getCurrentSummoner,
} from '@renderer/stores/atoms/currentSummoner.atom'
import { leagueAtom } from '@renderer/stores/atoms/league.atom'

const useLeagueListener = () => {
  const [league, setLeague] = useAtom(leagueAtom)
  const setCurrentSummoner = useSetAtom(currentSummonerAtom)

  const register = async () => {
    const isReady = await window.electron.apis('league', '/is-ready')

    setLeague({
      ...league,
      isReady: isReady,
    })

    window.electron.subscribeLeague('connect-change', async state => {
      const isReady = state === 'connect'

      setLeague({
        ...league,
        isReady,
      })

      const currentSummoner = await getCurrentSummoner({ checkIsReady: true })
      setCurrentSummoner(currentSummoner)
    })

    window.electron.subscribeLeague('in-game', isInGame => {
      setLeague({
        ...league,
        isReady: isInGame,
      })
    })
  }

  useEffect(() => {
    register()
  }, [])
}

export default useLeagueListener
