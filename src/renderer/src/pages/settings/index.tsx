import { useState } from 'react'
import { Controller } from 'react-hook-form'

import { Switch } from 'antd'
import { useRecoilState, useRecoilValue } from 'recoil'

import LayoutConfig from '@renderer/components/LayoutConfig'
import SaveButton from '@renderer/components/SaveButton'
import Section from '@renderer/components/Section'
import UpdateStatus from '@renderer/components/UpdateStatus'
import { useCustomForm } from '@renderer/hooks/useCustomForm'
import { useUpdateContentModal } from '@renderer/hooks/useUpdateContentModal'
import { configStore } from '@renderer/stores/config'
import { updateStore } from '@renderer/stores/update'
import { SettingsPageStyled } from '@renderer/styles/pageStyled/settingsPageStyled'

const Settings = () => {
  const [config, setConfig] = useRecoilState(configStore)
  const { version, status } = useRecoilValue(updateStore)
  const { open } = useUpdateContentModal()

  const form = useCustomForm({
    defaultValues: config.general,
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
            <a onClick={open} style={{ cursor: 'pointer' }}>
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
