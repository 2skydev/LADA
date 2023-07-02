import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useRecoilValue } from 'recoil'

import { championSelectSessionStore } from '@renderer/stores/championSelectSession'
import { LANE_ID } from '@renderer/types/league'

const useChampionDetailPageAutoNavigate = () => {
  const navigate = useNavigate()

  const data = useRecoilValue(championSelectSessionStore)

  useEffect(() => {
    const championId = data?.tempChampionId || data?.championId

    if (championId) {
      navigate(
        data.lane ? `/champ/${championId}?laneId=${LANE_ID[data.lane]}` : `/champ/${championId}`,
      )
    }
  }, [data])
}

export default useChampionDetailPageAutoNavigate
