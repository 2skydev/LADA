import ReadyTimerOverlay from '@renderer/features/overlay/ReadyTimerOverlay'
import * as Styled from '@renderer/styles/pageStyled/OverlaysClientPage.styled'

const OverlaysClientPage = () => {
  return (
    <Styled.Root>
      <ReadyTimerOverlay />
    </Styled.Root>
  )
}

export default OverlaysClientPage
