import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { initReactI18next } from 'react-i18next'

import * as Sentry from '@sentry/electron/renderer'
import { init as sentryReactInit } from '@sentry/react'
import 'antd/dist/reset.css'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import i18next from 'i18next'

import FileSystemRoutes from '@renderer/components/FileSystemRoutes'
import Providers from '@renderer/components/Providers/Providers'
import { dayjsLocaleResolvers } from '@renderer/i18n'

if (!import.meta.env.DEV) {
  Sentry.init(
    {
      dsn: import.meta.env.RENDERER_VITE_SENTRY_DSN,

      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      integrations: [
        new Sentry.Replay({
          maskAllText: false,
          maskAllInputs: false,
          blockAllMedia: false,
        }),
      ],
    },
    sentryReactInit,
  )
}

const currentResource = await window.electron.getCurrentI18nextResource()

await i18next.use(initReactI18next).init({
  lng: currentResource.language,
  resources: {
    [currentResource.language]: {
      [currentResource.ns]: currentResource.resource,
    },
  },
  debug: true,
})

dayjs.extend(relativeTime)

await dayjsLocaleResolvers[i18next.language]()

createRoot(document.getElementById('root') as HTMLElement).render(
  <Providers>
    <Suspense>
      <FileSystemRoutes />
    </Suspense>
  </Providers>,
)
