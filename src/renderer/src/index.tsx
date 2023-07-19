import { Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom'

import * as Sentry from '@sentry/electron/renderer'
import { init as sentryReactInit, reactRouterV6Instrumentation } from '@sentry/react'
import 'antd/dist/reset.css'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import relativeTime from 'dayjs/plugin/relativeTime'

import FileSystemRoutes from '@renderer/components/FileSystemRoutes'
import Providers from '@renderer/components/Providers/Providers'

window.electron.getVersion().then(version => {
  Sentry.init(
    {
      dsn: import.meta.env.RENDERER_VITE_SENTRY_DSN,

      release: version,

      tracesSampleRate: 0.2,

      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: reactRouterV6Instrumentation(
            useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
          ),
        }),

        new Sentry.Replay({
          maskAllText: false,
          maskAllInputs: false,
          blockAllMedia: false,
        }),
      ],
    },
    sentryReactInit,
  )
})

dayjs.extend(relativeTime)
dayjs.locale('ko')

createRoot(document.getElementById('root') as HTMLElement).render(
  <Providers>
    <Suspense>
      <FileSystemRoutes />
    </Suspense>
  </Providers>,
)
