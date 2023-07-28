import { useEffect } from 'react'

import { useAtom } from 'jotai'

import {
  currentSummonerAtom,
  getCurrentSummoner,
} from '@renderer/stores/atoms/currentSummoner.atom'

const useCurrentSummonerListener = () => {
  const [currentSummoner, setCurrentSummoner] = useAtom(currentSummonerAtom)

  useEffect(() => {
    window.electron.subscribeLeague('summoner/current', async data => {
      if (data && data.summonerId !== currentSummoner?.id) {
        const result = await getCurrentSummoner({ preparedData: data })
        setCurrentSummoner(result)
      } else if (!data) {
        setCurrentSummoner(null)
      }
    })
  }, [])
}

export default useCurrentSummonerListener
