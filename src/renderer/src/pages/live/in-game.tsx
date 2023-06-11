import { useRecoilValue } from 'recoil'

import LayoutConfig from '@renderer/components/LayoutConfig/LayoutConfig'
import InGameInfo from '@renderer/features/inGame/InGameInfo'
import SummonerNotFound from '@renderer/features/summoner/SummonerNotFound'
import { currentSummonerStore } from '@renderer/stores/currentSummoner'
import { LiveInGamePageStyled } from '@renderer/styles/pageStyled/liveInGamePageStyled'

const LiveInGame = () => {
  const currentSummoner = useRecoilValue(currentSummonerStore)

  return (
    <LiveInGamePageStyled>
      <LayoutConfig breadcrumbs={['라이브 게임', '인게임 정보']} />

      {currentSummoner ? <InGameInfo summonerPsId={currentSummoner.psId} /> : <SummonerNotFound />}
    </LiveInGamePageStyled>
  )
}

export default LiveInGame
