import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import clsx from 'clsx'

import { AutoAcceptEvent } from '@main/modules/league/types/auto-accept.types'

import * as Styled from './ReadyTimerOverlay.styled'

export interface ReadyTimerOverlayProps {
  className?: string
}

const ReadyTimerOverlay = ({ className }: ReadyTimerOverlayProps) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer',
  })

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
      {t('autoAcceptOverlay', {
        seconds: data.autoAcceptDelaySeconds! - data.timer!,
      })}
    </Styled.Root>
  )
}

export default ReadyTimerOverlay
