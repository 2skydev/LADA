import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useRecoilValue } from 'recoil'

import { championSelectSessionStore } from '@renderer/stores/championSelectSession'

const useChampionDetailPageAutoNavigate = () => {
  const navigate = useNavigate()

  const data = useRecoilValue(championSelectSessionStore)

  useEffect(() => {
    const championId = data?.tempChampionId || data?.championId

    if (championId) {
      navigate(data.lane ? `/champ/${championId}?laneId=${data.lane}` : `/champ/${championId}`)
    }
  }, [data])
}

export default useChampionDetailPageAutoNavigate
