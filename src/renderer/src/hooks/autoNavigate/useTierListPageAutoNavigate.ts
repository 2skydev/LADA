import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useRecoilValue } from 'recoil'

import { championSelectSessionStore } from '@renderer/stores/championSelectSession'
import { LANE_ID } from '@renderer/types/league'

const useTierListPageAutoNavigate = () => {
  const navigate = useNavigate()
  const [prevGameId, setPrevGameId] = useState<string | null>(null)

  const data = useRecoilValue(championSelectSessionStore)

  useEffect(() => {
    if (data && prevGameId !== data.gameId) {
      setPrevGameId(data.gameId)
      navigate(data.lane ? `/?laneId=${LANE_ID[data.lane]}` : '/')
    }
  }, [data])
}

export default useTierListPageAutoNavigate
