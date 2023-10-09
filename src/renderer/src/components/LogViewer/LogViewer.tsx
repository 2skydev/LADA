import { useTranslation } from 'react-i18next'
import { List } from 'react-virtualized'

import { Divider } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useTheme } from 'styled-components'

import * as Styled from './LogViewer.styled'

export interface LogViewerProps {
  className?: string
  path: string
  lines: string[]
}

const DATE_VIEW_WIDTH_LOCALES = {
  ko_KR: '5rem',
  en_US: '8rem',
}

const LogViewer = ({ className, path, lines: _lines }: LogViewerProps) => {
  const { i18n } = useTranslation()

  const {
    colors: { red, orange },
  } = useTheme()

  const lines = [..._lines].reverse()

  const statusColors = {
    error: red,
    warn: orange,
  }

  const dateViewWidth = DATE_VIEW_WIDTH_LOCALES[i18n.language]

  return (
    <Styled.Root className={clsx('LogViewer', className)}>
      <div className="path selectable">{path}</div>

      <Divider />

      {/* @ts-ignore 라이브러리 내부 타입 오류 무시 */}
      <List
        width={500}
        height={300}
        rowCount={lines.length}
        rowHeight={({ index }) => {
          return 20 * lines[index].split('\n').length + 10
        }}
        rowRenderer={({ index, key, style }) => {
          let line = lines[index]
          const date = line.match(/^\[([0-9\-._:\s]+)\]/)?.[1]
          const status = line.match(
            /^\[[0-9\-._:\s]+\] \[(info|debug|log|warn|error|verbose)\]/,
          )?.[1]

          const color = statusColors[status!]

          line = line.replace(/^\[[0-9\-._:\s]+\] /, '')
          line = line.replace(/^\[(info|debug|log|warn|error|verbose)\] /, '')

          return (
            <div
              key={key}
              style={{
                ...style,
                color,
              }}
            >
              <div
                style={{
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '20px',
                  }}
                >
                  <div className="selectable" style={{ width: dateViewWidth }}>
                    {dayjs(date).fromNow()}
                  </div>
                  <Divider type="vertical" style={{ borderColor: color, margin: '0 .6rem' }} />
                  <div className="selectable" style={{ width: '2.5rem' }}>
                    {status}
                  </div>
                  <Divider type="vertical" style={{ borderColor: color, margin: '0 .6rem' }} />
                </div>

                <div>
                  {line.split('\n').map((text, i) => (
                    <div key={i} className="selectable" style={{ height: 20 }}>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }}
      />
    </Styled.Root>
  )
}

export default LogViewer
