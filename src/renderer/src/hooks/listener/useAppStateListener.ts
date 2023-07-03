import { useEffect } from 'react'

import { useRecoilState, useSetRecoilState } from 'recoil'

import { appStateStore } from '@renderer/stores/app'
import { currentSummonerStore, getCurrentSummoner } from '@renderer/stores/currentSummoner'

const useAppStateListener = () => {
  const [appState, setAppState] = useRecoilState(appStateStore)
  const setCurrentSummoner = useSetRecoilState(currentSummonerStore)

  const register = async () => {
    const isReady = await window.electron.apis('league', '/is-ready')

    setAppState({
      ...appState,
      leagueIsReady: isReady,
    })

    window.electron.subscribeLeague('connect-change', async state => {
      const leagueIsReady = state === 'connect'

      setAppState({
        ...appState,
        leagueIsReady,
      })

      const currentSummoner = await getCurrentSummoner({ checkIsReady: true })
      setCurrentSummoner(currentSummoner)
    })

    window.electron.subscribeLeague('in-game', isInGame => {
      setAppState({
        ...appState,
        leagueIsInGame: isInGame,
      })
    })
  }

  useEffect(() => {
    register()
  }, [])
}

export default useAppStateListener
