import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAtomValue } from 'jotai'

import { championSelectSessionAtom } from '@renderer/stores/atoms/championSelectSession.atom'
import { configAtom } from '@renderer/stores/atoms/config.atom'

const useChampionDetailPageAutoNavigate = () => {
  const navigate = useNavigate()

  const {
    game: { useCurrentPositionChampionData },
  } = useAtomValue(configAtom)
  const data = useAtomValue(championSelectSessionAtom)

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
