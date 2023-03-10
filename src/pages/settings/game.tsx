import { Controller } from 'react-hook-form';

import { Switch } from 'antd';
import { useRecoilState } from 'recoil';

import LayoutConfig from '~/components/LayoutConfig';
import SaveButton from '~/components/SaveButton';
import Section from '~/components/Section';
import { useCustomForm } from '~/hooks/useCustomForm';
import { configStore } from '~/stores/config';
import { SettingsPageStyled } from '~/styles/pageStyled/settingsPageStyled';

const GameSettings = () => {
  const [config, setConfig] = useRecoilState(configStore);

  const form = useCustomForm({
    defaultValues: config.game,
    onSubmit: values => {
      setConfig({
        ...config,
        game: values,
      });
    },
  });

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
      </Section>

      <SaveButton defaultValues={config.game} form={form} />
    </SettingsPageStyled>
  );
};

export default GameSettings;
