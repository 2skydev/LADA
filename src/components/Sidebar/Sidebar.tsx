import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import clsx from 'clsx';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';

import logoImage from '~/assets/images/logo@256.png';
import { configStore } from '~/stores/config';

import LaneIcon from '../LaneIcon';
import { SidebarStyled } from './styled';

export interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const config = useRecoilValue(configStore);
  const { pathname } = useLocation();

  const menus = useMemo(
    () => [
      {
        title: '챔피언',
        items: [
          {
            icon: <LaneIcon laneId={0} />,
            link: '/',
            text: '챔피언 티어',
          },
        ],
      },
      {
        title: '유틸리티',
        items: [
          {
            icon: 'bx-group',
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
  );

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
                    const isActive = pathname === item.link;

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
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>
    </SidebarStyled>
  );
};

export default Sidebar;
