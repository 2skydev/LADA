import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Select, Switch } from 'antd'
import { useAtom, useAtomValue } from 'jotai'

import { ZOOM_PERCENT_ARRAY } from '@main/modules/electron/electron.constants'

import LayoutConfig from '@renderer/components/LayoutConfig'
import SaveButton from '@renderer/components/SaveButton'
import Section from '@renderer/components/Section'
import UpdateNoteModal from '@renderer/features/update/UpdateNoteModal'
import UpdateStatus from '@renderer/features/update/UpdateStatus'
import useAPI from '@renderer/hooks/useAPI'
import useCustomForm from '@renderer/hooks/useCustomForm'
import { appUpdateAtom } from '@renderer/stores/atoms/appUpdate.atom'
import { configAtom } from '@renderer/stores/atoms/config.atom'
import * as Styled from '@renderer/styles/pageStyled/SettingsPage.styled'

const SettingsPage = () => {
  const { data: languageOptions } = useAPI('getLanguageOptions', {
    revalidateIfStale: false,
  })

  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer',
  })

  const [config, setConfig] = useAtom(configAtom)
  const { version, status } = useAtomValue(appUpdateAtom)
  const [openUpdateNoteModal, setOpenUpdateNoteModal] = useState(false)

  const form = useCustomForm({
    defaultValues: config.general,
    syncDefaultValues: true,
    onSubmit: values => {
      setConfig({
        ...config,
        general: values,
      })
    },
  })

  return (
    <Styled.Root>
      <LayoutConfig breadcrumbs={[t('pages.setting'), t('pages.generalSetting')]} />

      <UpdateNoteModal open={openUpdateNoteModal} onClose={() => setOpenUpdateNoteModal(false)} />

      <Section
        title={t('setting.general.autoLaunch.title')}
        description={t('setting.general.autoLaunch.description')}
      >
        <Controller
          name="autoLaunch"
          control={form.control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onChange={checked => field.onChange(checked)}
              checkedChildren={<i className="bx bx-check" />}
              unCheckedChildren={<i className="bx bx-x" />}
            />
          )}
        />
      </Section>

      <Section
        title={t('setting.general.openWindowWhenLeagueClientLaunch.title')}
        description={t('setting.general.openWindowWhenLeagueClientLaunch.description')}
      >
        <Controller
          name="openWindowWhenLeagueClientLaunch"
          control={form.control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onChange={checked => field.onChange(checked)}
              checkedChildren={<i className="bx bx-check" />}
              unCheckedChildren={<i className="bx bx-x" />}
            />
          )}
        />
      </Section>

      <Section
        title={t('setting.general.language.title')}
        description={t('setting.general.language.description')}
      >
        <Controller
          name="language"
          control={form.control}
          render={({ field }) => (
            <Select
              style={{ width: '10rem' }}
              value={field.value}
              onChange={value => field.onChange(value)}
              options={(languageOptions || []).map(({ label, value }) => ({
                label: `${label} / ${value}`,
                value,
              }))}
            />
          )}
        />
      </Section>

      <Section
        title={t('setting.general.zoom.title')}
        description={t('setting.general.zoom.description')}
      >
        <Controller
          name="zoom"
          control={form.control}
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={value => field.onChange(value)}
              options={ZOOM_PERCENT_ARRAY.map(percent => ({
                label: `${percent}%`,
                value: percent / 100,
              }))}
            />
          )}
        />
      </Section>

      <Section
        title={t('setting.general.restoreWindowPosition.title')}
        description={t('setting.general.restoreWindowPosition.description')}
      >
        <Controller
          name="restoreWindowPosition"
          control={form.control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onChange={checked => field.onChange(checked)}
              checkedChildren={<i className="bx bx-check" />}
              unCheckedChildren={<i className="bx bx-x" />}
            />
          )}
        />
      </Section>

      <Section
        title={t('setting.general.developerMode.title')}
        description={t('setting.general.developerMode.description')}
      >
        <Controller
          name="developerMode"
          control={form.control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onChange={checked => field.onChange(checked)}
              checkedChildren={<i className="bx bx-code-alt" />}
              unCheckedChildren={<i className="bx bx-x" />}
            />
          )}
        />
      </Section>

      <Section
        title={t('setting.general.appVersion.title')}
        description={
          <div>
            {t('setting.general.appVersion.description')}
            <div className="spacing" />
            <a href="https://github.com/2skydev/LADA/releases" target="_blank" rel="noreferrer">
              {t('setting.general.appVersion.releaseList')}
            </a>{' '}
            /{' '}
            <a onClick={() => setOpenUpdateNoteModal(true)} style={{ cursor: 'pointer' }}>
              {t('setting.general.appVersion.updateNote')}
            </a>
          </div>
        }
      >
        <UpdateStatus version={version} status={status} />
      </Section>

      <SaveButton defaultValues={config.general} form={form} />
    </Styled.Root>
  )
}

export default SettingsPage
