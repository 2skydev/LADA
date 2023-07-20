import { Controller } from 'react-hook-form'

import { InputNumber, Switch } from 'antd'
import clsx from 'clsx'
import { useAtom } from 'jotai'

import LayoutConfig from '@renderer/components/LayoutConfig'
import SaveButton from '@renderer/components/SaveButton'
import Section from '@renderer/components/Section'
import { useCustomForm } from '@renderer/hooks/useCustomForm'
import { configAtom } from '@renderer/stores/atoms/config.atom'
import { SettingsPageStyled } from '@renderer/styles/pageStyled/settingsPageStyled'

const GameSettings = () => {
  const [config, setConfig] = useAtom(configAtom)

  const form = useCustomForm({
    defaultValues: config.game,
    onSubmit: values => {
      setConfig({
        ...config,
        game: values,
      })
    },
  })

  const isAutoAccept = form.watch('autoAccept')

  return (
    <SettingsPageStyled>
      <LayoutConfig breadcrumbs={['설정', '게임 설정']} />

      <Section
        title="매칭 자동 수락"
        description={
          <div>
            게임 매칭을 자동으로 수락할지 설정합니다.
            <br />이 설정을 활성화하면 수락 버튼을 누르지 않아도 매칭이 수락됩니다.
          </div>
        }
      >
        <div className="autoAcceptField">
          <Controller
            name="autoAccept"
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

          <div className={clsx('delay', !isAutoAccept && 'disabled')}>
            <div>자동 수락까지 대기시간</div>
            <Controller
              name="autoAcceptDelaySeconds"
              control={form.control}
              render={({ field }) => (
                <InputNumber
                  min={0}
                  max={8}
                  value={field.value}
                  onChange={value => field.onChange(value)}
                />
              )}
            />

            <div>초</div>
          </div>
        </div>
      </Section>

      <Section
        title="챔피언 정보 - 배치된 포지션 우선"
        description={
          <div>
            챔피언 선택 시 보여주는 정보를 현재 배치된 포지션 우선으로 표시됩니다.
            <br />이 설정을 비활성화하면 챔피언 선택 시 해당 챔피언의 주 포지션으로 표시됩니다.
          </div>
        }
      >
        <Controller
          name="useCurrentPositionChampionData"
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

      <SaveButton defaultValues={config.game} form={form} />
    </SettingsPageStyled>
  )
}

export default GameSettings
