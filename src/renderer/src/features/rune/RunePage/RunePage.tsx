import clsx from 'clsx'

import RuneGroup from '../RuneGroup'
import { RunePageStyled } from './styled'

export interface RunePageProps {
  className?: string
  mainRuneIds: [number, number, number, number]
  subRuneIds: [number, number]
  shardRuneIds: [number, number, number]
}

const RunePage = ({ className, mainRuneIds, subRuneIds, shardRuneIds }: RunePageProps) => {
  return (
    <RunePageStyled className={clsx('RunePage', className)}>
      <RuneGroup type="main" activeRuneIds={mainRuneIds} />

      <div className="right">
        <RuneGroup type="sub" activeRuneIds={subRuneIds} />
        <RuneGroup type="shard" activeRuneIds={shardRuneIds} />
      </div>
    </RunePageStyled>
  )
}

export default RunePage
