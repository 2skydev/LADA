import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'

import * as Sentry from '@sentry/electron/renderer'
import { init as sentryReactInit } from '@sentry/react'
import 'antd/dist/reset.css'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import relativeTime from 'dayjs/plugin/relativeTime'

import FileSystemRoutes from '@renderer/components/FileSystemRoutes'
import Providers from '@renderer/components/Providers/Providers'

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

dayjs.extend(relativeTime)
dayjs.locale('ko')

createRoot(document.getElementById('root') as HTMLElement).render(
  <Providers>
    <Suspense>
      <FileSystemRoutes />
    </Suspense>
  </Providers>,
)
