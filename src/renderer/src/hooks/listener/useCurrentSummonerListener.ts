import { useEffect } from 'react'

import { useRecoilState } from 'recoil'

import { currentSummonerStore, getCurrentSummoner } from '@renderer/stores/currentSummoner'

const useCurrentSummonerListener = () => {
  const [currentSummoner, setCurrentSummoner] = useRecoilState(currentSummonerStore)

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
