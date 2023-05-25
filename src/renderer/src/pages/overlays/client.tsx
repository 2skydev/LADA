import ReadyTimerOverlay from '@renderer/features/overlay/ReadyTimerOverlay'
import { OverlaysClientPageStyled } from '@renderer/styles/pageStyled/overlaysClientPageStyled'

const OverlaysClient = () => {
  return (
    <OverlaysClientPageStyled>
      <ReadyTimerOverlay />
    </OverlaysClientPageStyled>
  )
}

export default OverlaysClient
