import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { InputNumber, Segmented, Select, Space, Switch } from 'antd'
import clsx from 'clsx'
import { useAtom } from 'jotai'

import { STATS_PROVIDERS } from '@main/modules/league/league.constants'

import LayoutConfig from '@renderer/components/LayoutConfig'
import SaveButton from '@renderer/components/SaveButton'
import Section from '@renderer/components/Section'
import useCustomForm from '@renderer/hooks/useCustomForm'
import { configAtom } from '@renderer/stores/atoms/config.atom'
import * as Styled from '@renderer/styles/pageStyled/SettingsPage.styled'

const GameSettingsPage = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer',
  })

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
    <Styled.Root>
      <LayoutConfig breadcrumbs={[t('menus.setting'), t('menus.gameSetting')]} />

      <Section
        title={t('setting.game.statsProvider.title')}
        description={t('setting.game.statsProvider.description')}
      >
        <Controller
          name="statsProvider"
          control={form.control}
          render={({ field }) => (
            <Select
              style={{ width: '7rem' }}
              value={field.value}
              onChange={value => field.onChange(value)}
              options={STATS_PROVIDERS.map(provider => ({
                label: provider,
                value: provider,
                disabled: provider !== 'LOL.PS',
              }))}
            />
          )}
        />
      </Section>

      <Section
        title={t('setting.game.useCurrentPositionChampionData.title')}
        description={t('setting.game.useCurrentPositionChampionData.description')}
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

      <Section
        title={t('setting.game.autoAccept.title')}
        description={t('setting.game.autoAccept.description')}
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
            <div>{t('setting.game.autoAccept.autoAcceptDelaySeconds.label')}</div>
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

            <div>{t('setting.game.autoAccept.autoAcceptDelaySeconds.seconds')}</div>
          </div>
        </div>
      </Section>

      <Section
        title={t('setting.game.autoRuneSetting.title')}
        description={t('setting.game.autoRuneSetting.description')}
      >
        <Controller
          name="autoRuneSetting"
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
        title={t('setting.game.autoSummonerSpellSetting.title')}
        description={t('setting.game.autoSummonerSpellSetting.description')}
      >
        <Space>
          <Controller
            name="autoSummonerSpellSetting"
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

          <Controller
            name="flashKey"
            control={form.control}
            render={({ field }) => (
              <Segmented
                value={field.value}
                onChange={value => field.onChange(value)}
                options={[
                  {
                    label: `D ${t('setting.game.autoSummonerSpellSetting.flash')}`,
                    value: 'D',
                  },
                  {
                    label: `F ${t('setting.game.autoSummonerSpellSetting.flash')}`,
                    value: 'F',
                  },
                ]}
              />
            )}
          />
        </Space>
      </Section>

      <SaveButton defaultValues={config.game} form={form} />
    </Styled.Root>
  )
}

export default GameSettingsPage
