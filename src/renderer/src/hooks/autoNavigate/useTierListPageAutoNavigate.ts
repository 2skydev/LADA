import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAtomValue } from 'jotai'

import { championSelectSessionAtom } from '@renderer/stores/atoms/championSelectSession.atom'

const useTierListPageAutoNavigate = () => {
  const navigate = useNavigate()
  const [prevGameId, setPrevGameId] = useState<string | null>(null)

  const data = useAtomValue(championSelectSessionAtom)

  useEffect(() => {
    if (data && prevGameId !== data.gameId) {
      setPrevGameId(data.gameId)
      navigate(data.laneId ? `/?laneId=${data.laneId}` : '/')
    }
  }, [data])
}

export default useTierListPageAutoNavigate
