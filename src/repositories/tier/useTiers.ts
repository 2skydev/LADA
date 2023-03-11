import { LANE } from '~/types/lane';

import { useLaneTiers } from './useLaneTiers';

export const useTiers = () => {
  const { data: topLaneTiers } = useLaneTiers(LANE.TOP);
  const { data: jungleLaneTiers } = useLaneTiers(LANE.JUNGLE);
  const { data: midLaneTiers } = useLaneTiers(LANE.MID);
  const { data: ADLaneTiers } = useLaneTiers(LANE.ADC);
  const { data: supporterLaneTiers } = useLaneTiers(LANE.SUPPORT);

  const allLaneTiers = [
    ...topLaneTiers,
    ...jungleLaneTiers,
    ...midLaneTiers,
    ...ADLaneTiers,
    ...supporterLaneTiers,
  ];

  return { data: allLaneTiers };
};
