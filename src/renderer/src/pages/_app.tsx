import { useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { ConfigProvider, GlobalToken, theme } from 'antd'
import antdLocaleKR from 'antd/locale/ko_KR'
import { ThemeProvider } from 'styled-components'

import Layout from '@renderer/components/Layout'
import Titlebar from '@renderer/components/Titlebar'
import NeedUpdateLaterNotification from '@renderer/features/update/NeedUpdateLaterNotification'
import useChampionDetailPageAutoNavigate from '@renderer/hooks/autoNavigate/useChampionDetailPageAutoNavigate'
import useInGamePageAutoNavigate from '@renderer/hooks/autoNavigate/useInGamePageAutoNavigate'
import useTierListPageAutoNavigate from '@renderer/hooks/autoNavigate/useTierListPageAutoNavigate'
import useAppStateListener from '@renderer/hooks/listener/useAppStateListener'
import useAppUpdateListener from '@renderer/hooks/listener/useAppUpdateListener'
import useChampionSelectSessionListener from '@renderer/hooks/listener/useChampionSelectSessionListener'
import useCurrentSummonerListener from '@renderer/hooks/listener/useCurrentSummonerListener'
import { useUpdateContentModal } from '@renderer/hooks/useUpdateContentModal'
import { InitGlobalStyled } from '@renderer/styles/init'
import { antdTheme, colors, sizes } from '@renderer/styles/themes'

type Sizes = typeof sizes
type Colors = typeof colors

declare module 'styled-components' {
  export interface DefaultTheme {
    sizes: Sizes
    colors: Colors
    token: GlobalToken
  }
}

const App = () => {
  return (
    <ConfigProvider theme={antdTheme} locale={antdLocaleKR}>
      <AppInner />
    </ConfigProvider>
  )
}

const noLayoutPaths = [/\/windows\/.+/, /\/overlays\/.+/]

const AppInner = () => {
  const { pathname } = useLocation()
  const antdToken = theme.useToken()

  const styledTheme = useMemo(
    () => ({
      sizes: sizes,
      colors: colors,
      token: antdToken.token,
    }),
    [],
  )

  const isNoLayout = noLayoutPaths.some(path => path.test(pathname))

  useUpdateContentModal({ autoOpen: !isNoLayout })

  // listeners
  useAppStateListener()
  useAppUpdateListener()
  useChampionSelectSessionListener()
  useCurrentSummonerListener()

  // auto navigate
  useTierListPageAutoNavigate()
  useInGamePageAutoNavigate()
  useChampionDetailPageAutoNavigate()

  return (
    <ThemeProvider theme={styledTheme}>
      <InitGlobalStyled />

      {isNoLayout && <Outlet />}

      {!isNoLayout && (
        <div id="app">
          <NeedUpdateLaterNotification />

          <Titlebar />

          <Layout>
            <Outlet />
          </Layout>
        </div>
      )}
    </ThemeProvider>
  )
}

export default App
