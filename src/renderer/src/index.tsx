import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'

import 'antd/dist/reset.css'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import relativeTime from 'dayjs/plugin/relativeTime'
import { RecoilRoot } from 'recoil'
import { SWRConfig, SWRConfiguration } from 'swr'

import FileSystemRoutes from '@renderer/components/FileSystemRoutes'

dayjs.extend(relativeTime)
dayjs.locale('ko')

const swrConfig: SWRConfiguration = {
  errorRetryCount: 2,
  errorRetryInterval: 500,
  revalidateOnFocus: false,
  revalidateIfStale: false,
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <RecoilRoot>
    <SWRConfig value={swrConfig}>
      <Suspense>
        <FileSystemRoutes />
      </Suspense>
    </SWRConfig>
  </RecoilRoot>,
)
