import { useEffect, useMemo } from 'react';
import { Outlet } from 'react-router-dom';

import { ConfigProvider, theme } from 'antd';
import antdLocaleKR from 'antd/locale/ko_KR';
import { useRecoilState } from 'recoil';
import { ThemeProvider } from 'styled-components';

import Layout from '~/components/Layout';
import Titlebar from '~/components/Titlebar';
import { updateStore } from '~/stores/update';
import { InitGlobalStyled } from '~/styles/init';
import { antdTheme, colors, sizes } from '~/styles/themes';

type Sizes = typeof sizes;
type Colors = typeof colors;

declare module 'styled-components' {
  export interface DefaultTheme {
    sizes: Sizes;
    colors: Colors;
  }
}

const App = () => {
  return (
    <ConfigProvider theme={antdTheme} locale={antdLocaleKR}>
      <AppInner />
    </ConfigProvider>
  );
};

const AppInner = () => {
  const antdToken = theme.useToken();

  const [update, setUpdate] = useRecoilState(updateStore);

  const bootstrap = async () => {
    window.electron.onUpdate((event, data) => {
      setUpdate({
        ...update,
        status: {
          event,
          data,
          time: new Date().getTime(),
        },
      });
    });

    window.electron.initlizeUpdater();
  };

  const styledTheme = useMemo(
    () => ({
      sizes: sizes,
      colors: colors,
      token: antdToken.token,
    }),
    [],
  );

  useEffect(() => {
    bootstrap();
  }, []);

  return (
    <ThemeProvider theme={styledTheme}>
      <InitGlobalStyled />

      <div id="app">
        <Titlebar />

        <Layout>
          <Outlet />
        </Layout>
      </div>
    </ThemeProvider>
  );
};

export default App;
