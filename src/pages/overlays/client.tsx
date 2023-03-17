import ReadyTimerOverlay from '~/features/overlay/ReadyTimerOverlay';
import { OverlaysClientPageStyled } from '~/styles/pageStyled/overlaysClientPageStyled';

const OverlaysClient = () => {
  return (
    <OverlaysClientPageStyled>
      <ReadyTimerOverlay />
    </OverlaysClientPageStyled>
  );
};

export default OverlaysClient;
