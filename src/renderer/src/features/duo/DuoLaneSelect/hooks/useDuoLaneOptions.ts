import { useTranslation } from 'react-i18next'

import { LANE_ID_ENUM } from '@main/modules/league/types/lane.types'

const useDuoLaneOptions = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.stats.duoSynergy.lane',
  })

  return [
    [LANE_ID_ENUM.adc, LANE_ID_ENUM.sup, t('adc-sup')],
    [LANE_ID_ENUM.mid, LANE_ID_ENUM.jg, t('mid-jg')],
    [LANE_ID_ENUM.top, LANE_ID_ENUM.jg, t('top-jg')],
    [LANE_ID_ENUM.jg, LANE_ID_ENUM.sup, t('jg-sup')],
  ] as const
}

export default useDuoLaneOptions
