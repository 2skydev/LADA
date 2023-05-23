import clsx from 'clsx'
import { motion } from 'framer-motion'

import RuneGroup from '../RuneGroup'
import { RunePageStyled } from './styled'

export interface RunePageProps {
  className?: string
  mainRuneIds: [number, number, number, number]
  subRuneIds: [number, number]
  shardRuneIds: [number, number, number]
}

const RunePage = ({ className, mainRuneIds, subRuneIds, shardRuneIds }: RunePageProps) => {
  const key = `${mainRuneIds.join('')}${subRuneIds.join('')}${shardRuneIds.join('')}`

  return (
    <RunePageStyled className={clsx('RunePage', className)}>
      <motion.div
        key={key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <RuneGroup type="main" activeRuneIds={mainRuneIds} />

        <div className="right">
          <RuneGroup type="sub" activeRuneIds={subRuneIds} />
          <RuneGroup type="shard" activeRuneIds={shardRuneIds} />
        </div>
      </motion.div>
    </RunePageStyled>
  )
}

export default RunePage
