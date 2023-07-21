import { defineConfig, externalizeDepsPlugin, loadEnv, swcPlugin } from 'electron-vite'

import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  const env = loadEnv(mode, process.cwd(), '')

  const sentryVitePluginArray = isDev
    ? []
    : [
        sentryVitePlugin({
          org: '2skydev',
          project: 'lada',
          authToken: env.SENTRY_AUTH_TOKEN,
        }),
      ]

  return {
    main: {
      plugins: [externalizeDepsPlugin(), swcPlugin(), ...sentryVitePluginArray],
      build: {
        watch: {},
        sourcemap: true,
      },
      resolve: {
        alias: {
          '@main': resolve('src/main'),
        },
      },
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
    },
    renderer: {
      plugins: [
        react({
          babel: {
            plugins: [jotaiReactRefresh],
          },
        }),
        ...sentryVitePluginArray,
      ],
      resolve: {
        alias: {
          '@main': resolve('src/main'),
          '@renderer': resolve('src/renderer/src'),
        },
      },
      server: {
        port: 3000,
        strictPort: true,
      },
      build: {
        sourcemap: true,
      },
    },
  }
})
