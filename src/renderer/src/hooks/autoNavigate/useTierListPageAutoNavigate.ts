import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useRecoilValue } from 'recoil'

import { championSelectSessionStore } from '@renderer/stores/championSelectSession'

const useTierListPageAutoNavigate = () => {
  const navigate = useNavigate()
  const [prevGameId, setPrevGameId] = useState<string | null>(null)

  const data = useRecoilValue(championSelectSessionStore)

  useEffect(() => {
    if (data && prevGameId !== data.gameId) {
      setPrevGameId(data.gameId)
      navigate(data.laneId ? `/?laneId=${data.laneId}` : '/')
    }
  }, [data])
}

export default useTierListPageAutoNavigate
