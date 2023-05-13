import clsx from 'clsx'

import useAPI from '@renderer/hooks/useAPI'

import { ChampDetailStyled } from './styled'

export interface ChampDetailProps {
  className?: string
  champId: number
}

const ChampDetail = ({ className, champId }: ChampDetailProps) => {
  const { data } = useAPI('ps', `/champ/${champId}`)

  console.log(data)

  return <ChampDetailStyled className={clsx('ChampDetail', className)}></ChampDetailStyled>
}

export default ChampDetail
