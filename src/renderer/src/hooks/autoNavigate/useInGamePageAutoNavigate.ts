import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAtomValue } from 'jotai'

import { leagueAtom } from '@renderer/stores/atoms/league.atom'

const useInGamePageAutoNavigate = () => {
  const navigate = useNavigate()

  const { isInGame } = useAtomValue(leagueAtom)

  useEffect(() => {
    if (isInGame) {
      navigate('/live/in-game')
    }
  }, [isInGame])
}

export default useInGamePageAutoNavigate
