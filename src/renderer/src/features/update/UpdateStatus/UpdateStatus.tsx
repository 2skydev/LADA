import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'

import type { UpdateStatus as UpdateStatusType } from '@main/modules/update/types/update-status.type'

import * as Styled from './UpdateStatus.styled'

export interface UpdateStatusProps {
  version: string
  status: UpdateStatusType
  className?: string
}

const UpdateStatus = ({ className, version, status }: UpdateStatusProps) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.setting.general.appVersion.updateStatus',
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleCheckForUpdate = () => {
    setIsLoading(true)
    window.electron.checkForUpdate()
  }

  const handleUpdateNow = () => {
    setIsLoading(true)
    window.electron.quitAndInstall()
  }

  useEffect(() => {
    if (status.event === 'checking-for-update') {
      setIsLoading(false)
    }
  }, [status])

  return (
    <Styled.Root className={clsx('UpdateStatus', className)}>
      <div className="version">
        {t('currentVersion')} <em>v{version}</em>
      </div>

      <div className="description">
        {status.event === 'checking-for-update' && t('checking-for-update.description')}

        {status.event === 'update-available' && t('update-available.description')}

        {status.event === 'update-not-available' && (
          <>
            {t('update-not-available.description')} ({dayjs(status.time).fromNow()})
            <Button loading={isLoading} onClick={handleCheckForUpdate}>
              {t('update-not-available.checkForUpdate')}
            </Button>
          </>
        )}

        {status.event === 'error' && (
          <>
            {t('error.description')}
            <Button onClick={handleCheckForUpdate}>{t('error.checkForUpdate')}</Button>
          </>
        )}

        {status.event === 'download-progress' && (
          <>
            {Number(status.data.percent).toFixed(1)}% {t('download-progress.description')}
          </>
        )}

        {status.event === 'update-downloaded' && (
          <>
            {t('update-downloaded.description')}
            <Button onClick={handleUpdateNow}>{t('update-downloaded.quitAndInstall')}</Button>
          </>
        )}
      </div>
    </Styled.Root>
  )
}

export default UpdateStatus
