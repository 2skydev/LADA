import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import clsx from 'clsx'
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion'
import { useAtomValue } from 'jotai'

import { LANE_ID_ENUM } from '@main/modules/league/types/lane.types'

import logoImage from '@renderer/assets/images/logo@256.png'
import LaneIcon from '@renderer/features/lane/LaneIcon'
import { configAtom } from '@renderer/stores/atoms/config.atom'

import * as Styled from './Sidebar.styled'

export interface SidebarProps {
  className?: string
}

interface Menu {
  title: string
  items: MenuItem[]
}

interface MenuItem {
  icon: ReactNode
  link: string
  text: string
  isActiveFn?: (pathname: string) => boolean
}

const Sidebar = ({ className }: SidebarProps) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.menus',
  })

  const config = useAtomValue(configAtom)
  const { pathname } = useLocation()

  const menus: Menu[] = useMemo(
    () => [
      {
        title: t('stats'),
        items: [
          {
            icon: <LaneIcon laneId={LANE_ID_ENUM.top} />,
            link: '/',
            text: t('championTier'),
            isActiveFn: (pathname: string) => pathname === '/' || pathname.includes('/champions/'),
          },
          {
            icon: 'bx-group',
            link: '/duo-synergy',
            text: t('duoSynergy'),
          },
        ],
      },
      {
        title: t('live'),
        items: [
          {
            icon: 'bx-user-check',
            link: '/lives/champion-select',
            text: t('championSelect'),
          },
          {
            icon: 'bx-search-alt',
            link: '/lives/in-game',
            text: t('inGame'),
          },
        ],
      },
      {
        title: t('utility'),
        items: [
          {
            icon: 'bx-network-chart',
            link: '/team',
            text: t('customGameTeamManager'),
          },
        ],
      },
      {
        title: t('setting'),
        items: [
          {
            icon: 'bx-cog',
            link: '/settings',
            text: t('generalSetting'),
          },
          {
            icon: 'bx-joystick',
            link: '/settings/game',
            text: t('gameSetting'),
          },
          ...(config.general.developerMode
            ? [
                {
                  icon: 'bx-code-alt',
                  link: '/settings/developers',
                  text: t('developerSetting'),
                },
              ]
            : []),
        ],
      },
    ],
    [config.general.developerMode],
  )

  return (
    <Styled.Root className={clsx('Sidebar', className)}>
      <div className="logo">
        <img src={logoImage} alt="logo" />
        LADA
      </div>

      <LayoutGroup>
        <div className="menus">
          {menus.map(menuGroup => (
            <div key={menuGroup.title} className="menuGroup">
              <div className="title">{menuGroup.title}</div>

              <div className="items">
                <AnimatePresence>
                  {menuGroup.items.map(item => {
                    const isActive = item?.isActiveFn
                      ? item?.isActiveFn(pathname)
                      : pathname === item.link

                    return (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                      >
                        <Link
                          key={item.text}
                          to={item.link}
                          className={clsx('item', isActive && 'active')}
                        >
                          {isActive && (
                            <motion.div
                              className="menuActiveBG"
                              layoutId="menuActiveBG"
                              initial={false}
                              transition={{
                                type: 'spring',
                                stiffness: 500,
                                damping: 35,
                              }}
                            />
                          )}

                          {typeof item.icon === 'string' ? (
                            <i className={`bx ${item.icon}`} />
                          ) : (
                            item.icon
                          )}
                          <span>{item.text}</span>
                        </Link>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>
    </Styled.Root>
  )
}

export default Sidebar
