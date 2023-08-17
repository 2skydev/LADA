import { useEffect } from 'react'

import deepEqual from 'fast-deep-equal'
import { useAtom } from 'jotai'

import {
  currentSummonerAtom,
  getCurrentSummoner,
} from '@renderer/stores/atoms/currentSummoner.atom'

const useCurrentSummonerListener = () => {
  const [currentSummoner, setCurrentSummoner] = useAtom(currentSummonerAtom)

  useEffect(() => {
    window.electron.subscribeLeague('summoner/current', async data => {
      if (!data) {
        setCurrentSummoner(null)
        return
      }

      const result = await getCurrentSummoner()

      if (!deepEqual(result, currentSummoner)) {
        setCurrentSummoner(result)
      }
    })
  }, [])
}

export default useCurrentSummonerListener
