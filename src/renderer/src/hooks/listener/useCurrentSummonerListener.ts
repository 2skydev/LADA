import { useEffect } from 'react'

import deepEqual from 'fast-deep-equal'
import { useAtom } from 'jotai'

import { currentSummonerAtom } from '@renderer/stores/atoms/currentSummoner.atom'

const useCurrentSummonerListener = () => {
  const [currentSummoner, setCurrentSummoner] = useAtom(currentSummonerAtom)

  useEffect(() => {
    window.electron.onChangeCurrentSummoner(data => {
      if (!data) {
        setCurrentSummoner(null)
        return
      }

      if (!deepEqual(data, currentSummoner)) {
        setCurrentSummoner(data)
      }
    })
  }, [])
}

export default useCurrentSummonerListener
