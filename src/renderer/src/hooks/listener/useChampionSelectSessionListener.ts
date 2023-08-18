import { useEffect } from 'react'

import deepEqual from 'fast-deep-equal'
import { useAtom, useAtomValue } from 'jotai'

import { championSelectSessionAtom } from '@renderer/stores/atoms/championSelectSession.atom'
import { currentSummonerAtom } from '@renderer/stores/atoms/currentSummoner.atom'

const useChampionSelectSessionListener = () => {
  const currentSummoner = useAtomValue(currentSummonerAtom)
  const [championSelectSession, setChampionSelectSession] = useAtom(championSelectSessionAtom)

  useEffect(() => {
    const unsubscribe = window.electron.onChangeChampionSelectSession(data => {
      if (!data.gameId) return

      if (!deepEqual(data, championSelectSession)) {
        setChampionSelectSession(data)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [currentSummoner?.id, championSelectSession])
}

export default useChampionSelectSessionListener
