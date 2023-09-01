import LayoutConfig from '@renderer/components/LayoutConfig/LayoutConfig'
import InGameInfo from '@renderer/features/inGame/InGameInfo'
import * as Styled from '@renderer/styles/pageStyled/LiveInGamePage.styled'

const LiveInGamePage = () => {
  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={['라이브 게임', '인게임 정보']} />
      <InGameInfo />
    </Styled.Root>
  )
}

export default LiveInGamePage
