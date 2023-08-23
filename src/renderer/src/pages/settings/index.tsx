import { useState } from 'react'
import { Controller } from 'react-hook-form'

import { Select, Switch } from 'antd'
import { useAtom, useAtomValue } from 'jotai'

import { ZOOM_PERCENT_ARRAY } from '@main/modules/electron/electron.constants'

import LayoutConfig from '@renderer/components/LayoutConfig'
import SaveButton from '@renderer/components/SaveButton'
import Section from '@renderer/components/Section'
import UpdateNoteModal from '@renderer/features/update/UpdateNoteModal'
import UpdateStatus from '@renderer/features/update/UpdateStatus'
import useCustomForm from '@renderer/hooks/useCustomForm'
import { appUpdateAtom } from '@renderer/stores/atoms/appUpdate.atom'
import { configAtom } from '@renderer/stores/atoms/config.atom'
import { SettingsPageStyled } from '@renderer/styles/pageStyled/settingsPageStyled'

const Settings = () => {
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
    <SettingsPageStyled>
      <LayoutConfig breadcrumbs={['설정', '일반 설정']} />

      <UpdateNoteModal open={openUpdateNoteModal} onClose={() => setOpenUpdateNoteModal(false)} />

      <Section
        title="컴퓨터 부팅시 최소화로 자동 시작"
        description={<div>컴퓨터가 켜진 후 자동으로 앱이 최소화 모드로 시작되도록 설정합니다.</div>}
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
        title="LADA 자동 창 열기"
        description={
          <div>
            롤 클라이언트가 켜지면 자동으로 LADA 창이 열립니다.
            <br />
            LADA가 최소화 모드로 실행되어 있어야 합니다.
          </div>
        }
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
        title="앱 비율 설정"
        description={
          <div>
            앱 화면의 비율을 설정합니다.
            <br />
            기본 값은 100% 입니다.
          </div>
        }
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
        title="개발자모드 설정"
        description={
          <div>
            개발자모드를 활성화할지 설정합니다.
            <br />
            개발자모드가 활성화되면 개발자 도구가 활성화됩니다.
          </div>
        }
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
        title="앱 버전"
        description={
          <div>
            현재 앱 버전이 몇인지 확인하실 수 있습니다.
            <br />
            아래 링크를 통해 변경된 사항을 확인하실 수 있습니다.
            <br />
            <div className="spacing" />
            <a href="https://github.com/2skydev/LADA/releases" target="_blank">
              앱 릴리즈 목록
            </a>{' '}
            /{' '}
            <a onClick={() => setOpenUpdateNoteModal(true)} style={{ cursor: 'pointer' }}>
              업데이트 내역
            </a>
          </div>
        }
      >
        <UpdateStatus version={version} status={status} />
      </Section>

      <SaveButton defaultValues={config.general} form={form} />
    </SettingsPageStyled>
  )
}

export default Settings
