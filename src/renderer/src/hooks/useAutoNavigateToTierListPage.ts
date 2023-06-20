import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useRecoilValue } from 'recoil'

import { champSelectSessionStore } from '@renderer/stores/champSelectSession'
import { LANE_ID } from '@renderer/types/league'

const useAutoNavigateToTierListPage = () => {
  const navigate = useNavigate()
  const [prevGameId, setPrevGameId] = useState<string | null>(null)

  const data = useRecoilValue(champSelectSessionStore)

  useEffect(() => {
    if (data && prevGameId !== data.gameId) {
      setPrevGameId(data.gameId)
      navigate(data.lane ? `/?laneId=${LANE_ID[data.lane]}` : '/')
    }
  }, [data])
}

export default useAutoNavigateToTierListPage
