import { Fragment } from 'react'
import { useLocation } from 'react-router-dom'

import { Button } from 'antd'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtomValue } from 'jotai'

import DataDragonImage from '@renderer/features/asset/DataDragonImage'
import { currentSummonerAtom } from '@renderer/stores/atoms/currentSummoner.atom'
import { layoutAtom } from '@renderer/stores/atoms/layout.atom'

import { ContentStyled } from './styled'

export interface ContentProps {
  className?: string
  children: React.ReactNode
}

const Content = ({ className, children }: ContentProps) => {
  const { breadcrumbs } = useAtomValue(layoutAtom)
  const currentSummoner = useAtomValue(currentSummonerAtom)
  const { pathname } = useLocation()

  return (
    <ContentStyled className={clsx('Content', className)}>
      <div className="header">
        <div className="left">
          <i className="bx bx-hash" />

          <div className="breadcrumb">
            {breadcrumbs.map((text, i) => (
              <Fragment key={i}>
                <div className="item">
                  <AnimatePresence mode="wait">
                    <motion.span
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      exit={{ y: -20 }}
                      transition={{ duration: 0.15 }}
                      key={text + i}
                      className="text"
                    >
                      {text}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {i !== breadcrumbs.length - 1 && <div className="divider" />}
              </Fragment>
            ))}
          </div>
        </div>

        {currentSummoner && (
          <Button
            type="text"
            className="right"
            icon={
              <DataDragonImage
                type="profileicon"
                filename={currentSummoner.profileIconId}
                size="28px"
                circle
              />
            }
          >
            <span>{currentSummoner.name}</span>
          </Button>
        )}
      </div>

      <div className="content">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </ContentStyled>
  )
}

export default Content
