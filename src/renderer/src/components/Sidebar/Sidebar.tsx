import { ReactNode, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

import clsx from 'clsx'
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion'
import { useRecoilValue } from 'recoil'

import logoImage from '@renderer/assets/images/logo@256.png'
import LaneIcon from '@renderer/features/asset/LaneIcon'
import { configStore } from '@renderer/stores/config'
import { LANE_ID } from '@renderer/types/league'

import { SidebarStyled } from './styled'

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
  const config = useRecoilValue(configStore)
  const { pathname } = useLocation()

  const menus: Menu[] = useMemo(
    () => [
      {
        title: '통계',
        items: [
          {
            icon: <LaneIcon laneId={LANE_ID.top} />,
            link: '/',
            text: '챔피언 티어',
            isActiveFn: (pathname: string) => pathname === '/' || pathname.includes('/champ/'),
          },
          {
            icon: 'bx-group',
            link: '/duo-synergy',
            text: '듀오 시너지',
          },
        ],
      },
      {
        title: '라이브 게임',
        items: [
          {
            icon: 'bx-search-alt',
            link: '/live/in-game',
            text: '인게임 정보',
          },
        ],
      },
      {
        title: '유틸리티',
        items: [
          {
            icon: 'bx-network-chart',
            link: '/team',
            text: '5:5 팀 구성',
          },
        ],
      },
      {
        title: '설정',
        items: [
          {
            icon: 'bx-cog',
            link: '/settings',
            text: '일반 설정',
          },
          {
            icon: 'bx-joystick',
            link: '/settings/game',
            text: '게임 설정',
          },
          ...(config.general.developerMode
            ? [
                {
                  icon: 'bx-code-alt',
                  link: '/settings/developers',
                  text: '개발자 옵션',
                },
              ]
            : []),
        ],
      },
    ],
    [config.general.developerMode],
  )

  return (
    <SidebarStyled className={clsx('Sidebar', className)}>
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
    </SidebarStyled>
  )
}

export default Sidebar
