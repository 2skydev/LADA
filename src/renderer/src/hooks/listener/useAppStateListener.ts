import { useEffect } from 'react'

import { useRecoilState } from 'recoil'

import { appStateStore } from '@renderer/stores/app'

const useAppStateListener = () => {
  const [appState, setAppState] = useRecoilState(appStateStore)

  const register = async () => {
    const isReady = await window.electron.apis('league', '/is-ready')

    setAppState({
      ...appState,
      leagueIsReady: isReady,
    })

    window.electron.subscribeLeague('connect-change', state => {
      setAppState({
        ...appState,
        leagueIsReady: state === 'connect',
      })
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
