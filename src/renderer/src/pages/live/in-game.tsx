import LayoutConfig from '@renderer/components/LayoutConfig/LayoutConfig'
import InGameInfo from '@renderer/features/inGame/InGameInfo'
import { LiveInGamePageStyled } from '@renderer/styles/pageStyled/liveInGamePageStyled'

const LiveInGame = () => {
  return (
    <LiveInGamePageStyled>
      <LayoutConfig breadcrumbs={['라이브 게임', '인게임 정보']} />
      <InGameInfo />
    </LiveInGamePageStyled>
  )
}

export default LiveInGame
