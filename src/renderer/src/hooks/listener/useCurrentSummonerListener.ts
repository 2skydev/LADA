import { useEffect } from 'react'

import { useRecoilState } from 'recoil'

import { currentSummonerStore } from '@renderer/stores/currentSummoner'

const useCurrentSummonerListener = () => {
  const [currentSummoner, setCurrentSummoner] = useRecoilState(currentSummonerStore)

  useEffect(() => {
    window.electron.subscribeLeague('summoner/current', async data => {
      if (data && data.summonerId !== currentSummoner?.id) {
        const psId = await window.electron.apis('ps', `/summoner-ps-id/${data.displayName}`)

        setCurrentSummoner({
          id: data.summonerId,
          name: data.displayName,
          profileIconId: data.profileIconId,
          psId,
        })
      } else if (!data) {
        setCurrentSummoner(null)
      }
    })
  }, [])
}

export default useCurrentSummonerListener
