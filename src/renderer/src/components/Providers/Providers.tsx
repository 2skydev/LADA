import { ReactNode, useLayoutEffect, useMemo, useState } from 'react'

import { ConfigProvider, theme } from 'antd'
import { GlobalToken } from 'antd'
import i18next from 'i18next'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { SWRConfig, SWRConfiguration } from 'swr'

import { antdLocaleResolvers } from '@renderer/i18n'
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
  const [locale, setLocale] = useState(undefined)

  const loadLocale = async () => {
    const locale = await antdLocaleResolvers[i18next.language]()
    setLocale(locale)
  }

  useLayoutEffect(() => {
    loadLocale()
  }, [])

  return (
    <SWRConfig value={swrConfig}>
      <ConfigProvider theme={antdTheme} locale={locale}>
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
