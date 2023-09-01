import { useEffect, useState } from 'react'

import clsx from 'clsx'

import { AutoAcceptEvent } from '@main/modules/league/types/auto-accept.types'

import * as Styled from './ReadyTimerOverlay.styled'

export interface ReadyTimerOverlayProps {
  className?: string
}

const ReadyTimerOverlay = ({ className }: ReadyTimerOverlayProps) => {
  const [data, setData] = useState<AutoAcceptEvent | null>(null)

  useEffect(() => {
    const unsubscribe = window.electron.onAutoAccept(event => {
      if (event.playerResponse === 'None') {
        setData(event)
      } else {
        setData(null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  if (!data) return null

  return (
    <Styled.Root className={clsx('ReadyTimerOverlay', className)}>
      자동 수락까지 <span>{data.autoAcceptDelaySeconds! - data.timer!}</span>초 남았습니다
    </Styled.Root>
  )
}

export default ReadyTimerOverlay
