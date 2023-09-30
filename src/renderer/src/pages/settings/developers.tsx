import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from 'antd'
import dayjs from 'dayjs'
import useSWR from 'swr'

import LayoutConfig from '@renderer/components/LayoutConfig'
import LogViewer from '@renderer/components/LogViewer'
import Section from '@renderer/components/Section'
import * as Styled from '@renderer/styles/pageStyled/SettingsDevelopersPage.styled'

const RELOAD_MINUTE = 1

const SettingsDevelopersPage = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer',
  })

  const { data, isValidating, mutate } = useSWR('@app/developers', async () => {
    const storePath = await window.electron.getStorePath()
    const logs = await window.electron.getLogs()

    return {
      storePath,
      logs,
      time: new Date().getTime(),
    }
  })

  const handleClearLogs = async () => {
    await window.electron.clearLogs()
    mutate()
  }

  useEffect(() => {
    if (data && dayjs().diff(dayjs(data.time), 'minute') >= RELOAD_MINUTE) {
      mutate()
    }

    const interval = setInterval(() => {
      mutate()
    }, 1000 * 60 * RELOAD_MINUTE)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={[t('pages.setting'), t('pages.developerSetting')]} />

      <Section
        title={t('setting.developer.dataRefreshTime.title')}
        description={t('setting.developer.dataRefreshTime.description', {
          minute: RELOAD_MINUTE,
        })}
      >
        {data && (
          <div className="date">
            {dayjs(data.time).fromNow()}{' '}
            <span>({dayjs(data.time).format('YYYY.MM.DD / a h:mm:ss')})</span>
            <Button
              className="sectionButton"
              loading={isValidating}
              onClick={() => {
                mutate()
              }}
            >
              {t('setting.developer.dataRefreshTime.refresh')}
            </Button>
          </div>
        )}
      </Section>

      <Section
        title={t('setting.developer.storePath.title')}
        description={t('setting.developer.storePath.description')}
      >
        <mark className="selectable">{data?.storePath}</mark>
      </Section>

      <Section
        title={t('setting.developer.logs.title')}
        description={t('setting.developer.logs.description')}
      >
        {data && (
          <>
            <div className="size">
              {t('setting.developer.logs.logSize')}{' '}
              <em>{(data.logs.reduce((acc, item) => acc + item.size, 0) / 1024).toFixed(1)} KB</em>
            </div>

            <Button
              danger
              className="sectionButton"
              loading={isValidating}
              onClick={handleClearLogs}
            >
              {t('setting.developer.logs.clear')}
            </Button>
          </>
        )}
      </Section>

      {data && (
        <div className="logs">
          {data.logs.map(log => (
            <LogViewer key={log.path} path={log.path} lines={log.lines} />
          ))}
        </div>
      )}
    </Styled.Root>
  )
}

export default SettingsDevelopersPage
