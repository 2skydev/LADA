import { defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'

import react from '@vitejs/plugin-react'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), swcPlugin()],
    build: {
      watch: {},
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
  },
})
