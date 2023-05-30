import { useEffect, useState } from 'react'

import clsx from 'clsx'

import { ReadyTimerOverlayStyled } from './styled'

export interface ReadyTimerOverlayProps {
  className?: string
}

interface AutoAcceptData {
  timer?: number
  playerResponse: string
  autoAcceptDelaySeconds?: number
}

const ReadyTimerOverlay = ({ className }: ReadyTimerOverlayProps) => {
  const [data, setData] = useState<AutoAcceptData | null>(null)

  useEffect(() => {
    window.electron.subscribeLeague('auto-accept', (data: AutoAcceptData) => {
      if (data.playerResponse === 'None') {
        setData(data)
      } else {
        setData(null)
      }
    })

    return () => {
      window.electron.unsubscribeLeague('auto-accept')
    }
  }, [])

  if (!data) return null

  return (
    <ReadyTimerOverlayStyled className={clsx('ReadyTimerOverlay', className)}>
      자동 수락까지 <span>{data.autoAcceptDelaySeconds! - data.timer!}</span>초 남았습니다
    </ReadyTimerOverlayStyled>
  )
}

export default ReadyTimerOverlay
