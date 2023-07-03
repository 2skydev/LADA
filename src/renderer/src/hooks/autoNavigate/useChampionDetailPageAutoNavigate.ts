import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useRecoilValue } from 'recoil'

import { championSelectSessionStore } from '@renderer/stores/championSelectSession'
import { configStore } from '@renderer/stores/config'

const useChampionDetailPageAutoNavigate = () => {
  const navigate = useNavigate()

  const {
    game: { useCurrentPositionChampionData },
  } = useRecoilValue(configStore)
  const data = useRecoilValue(championSelectSessionStore)

  const championId = data?.tempChampionId || data?.championId

  useEffect(() => {
    if (championId) {
      navigate(
        data.laneId && useCurrentPositionChampionData
          ? `/champ/${championId}?laneId=${data.laneId}`
          : `/champ/${championId}`,
      )
    }
  }, [championId])
}

export default useChampionDetailPageAutoNavigate
