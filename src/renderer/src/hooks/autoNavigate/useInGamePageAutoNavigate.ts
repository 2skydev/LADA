import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useRecoilValue } from 'recoil'

import { appStateStore } from '@renderer/stores/app'

const useInGamePageAutoNavigate = () => {
  const navigate = useNavigate()

  const { leagueIsInGame } = useRecoilValue(appStateStore)

  useEffect(() => {
    if (leagueIsInGame) {
      navigate('/live/in-game')
    }
  }, [leagueIsInGame])
}

export default useInGamePageAutoNavigate
