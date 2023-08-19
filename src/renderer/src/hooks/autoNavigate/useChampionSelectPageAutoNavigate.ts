import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAtomValue } from 'jotai'

import { championSelectSessionAtom } from '@renderer/stores/atoms/championSelectSession.atom'

const useChampionSelectPageAutoNavigate = () => {
  const navigate = useNavigate()

  const data = useAtomValue(championSelectSessionAtom)

  const championId = data?.tempChampionId || data?.championId

  useEffect(() => {
    if (championId) navigate('/live/champion-select')
  }, [championId])
}

export default useChampionSelectPageAutoNavigate
