import { ReactNode, useMemo } from 'react'

import { ConfigProvider, theme } from 'antd'
import { GlobalToken } from 'antd'
import antdLocaleKR from 'antd/locale/ko_KR'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { SWRConfig, SWRConfiguration } from 'swr'

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

export interface ProvidersProps {
  children?: ReactNode
}

const swrConfig: SWRConfiguration = {
  errorRetryCount: 2,
  errorRetryInterval: 500,
  revalidateOnFocus: false,
  revalidateIfStale: false,
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <SWRConfig value={swrConfig}>
      <ConfigProvider theme={antdTheme} locale={antdLocaleKR}>
        <ThemeProvider>{children}</ThemeProvider>
      </ConfigProvider>
    </SWRConfig>
  )
}

const ThemeProvider = ({ children }: ProvidersProps) => {
  const antdToken = theme.useToken()

  const styledTheme = useMemo(
    () => ({
      sizes: sizes,
      colors: colors,
      token: antdToken.token,
    }),
    [],
  )

  return <StyledThemeProvider theme={styledTheme}>{children}</StyledThemeProvider>
}

export default Providers
