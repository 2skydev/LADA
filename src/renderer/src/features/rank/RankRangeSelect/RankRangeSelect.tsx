import { Select } from 'antd'
import clsx from 'clsx'
import { useAtom } from 'jotai'

import { RANK_RANGE_IDS, RANK_RANGE_ID_TO_LABEL_MAP } from '@main/modules/ps/ps.constants'

import { rankRangeIdAtom } from '@renderer/features/rank/RankRangeSelect/rankRangeId.atom'

import { RankRangeSelectStyled } from './styled'

export interface RankRangeSelectProps {
  className?: string
}

/**
 * 해당 컴포넌트는 전역 상태를 사용합니다.
 * 자동으로 전역 상태를 업데이트하며 값 접근은 rankRangeIdAtom을 통해 가능합니다.
 */
const RankRangeSelect = ({ className }: RankRangeSelectProps) => {
  const [rankRangeId, setRankRangeId] = useAtom(rankRangeIdAtom)

  return (
    <RankRangeSelectStyled className={clsx('RankRangeSelect', className)}>
      <Select
        value={rankRangeId}
        onChange={value => setRankRangeId(value)}
        options={RANK_RANGE_IDS.map(id => ({ value: id, label: RANK_RANGE_ID_TO_LABEL_MAP[id] }))}
      />
    </RankRangeSelectStyled>
  )
}

export default RankRangeSelect
