import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import clsx from 'clsx';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';

import { configStore } from '~/stores/config';

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
        title: '테스트',
        items: [
          {
            icon: 'bx-home-alt-2',
            link: '/',
            text: '메인페이지',
          },
          {
            link: '/testpage',
            text: '404테스트',
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
        <svg
          fill="none"
          viewBox="0 0 262 40"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="70%"
          height="100%"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#2F3130"
            d="M18.2301 2.57684V16.2092H31.3369C31.8142 15.7262 32.381 15.3429 33.005 15.0814C33.629 14.82 34.2979 14.6854 34.9735 14.6854C35.649 14.6854 36.3179 14.82 36.9419 15.0814C37.566 15.3429 38.1328 15.7262 38.6101 16.2092H51.7169V2.57684H18.2301Z"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#727272"
            d="M40.9262 6.01641C40.9239 7.20586 40.5728 8.36794 39.9171 9.35583C39.2615 10.3437 38.3307 11.1131 37.2425 11.5667C36.1542 12.0203 34.9573 12.1378 33.803 11.9044C32.6487 11.6709 31.5888 11.097 30.7571 10.2552C29.9255 9.4133 29.3595 8.34126 29.1307 7.1745C28.9018 6.00775 29.0204 4.79863 29.4714 3.69994C29.9225 2.60125 30.6857 1.6623 31.6646 1.00171C32.6436 0.341122 33.7944 -0.0114496 34.9716 -0.0114517C36.5509 -0.0114517 38.0654 0.622419 39.1821 1.75072C40.2988 2.87901 40.9262 4.40931 40.9262 6.00496"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#727272"
            d="M40.9262 0H29.0209V12.029H40.9262V0Z"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#2F3130"
            d="M38.6592 6.01641C38.6592 6.75333 38.443 7.4737 38.0378 8.08642C37.6326 8.69914 37.0566 9.1767 36.3828 9.4587C35.709 9.74071 34.9675 9.81449 34.2522 9.67072C33.5369 9.52696 32.8798 9.1721 32.3641 8.65102C31.8484 8.12995 31.4972 7.46605 31.3549 6.7433C31.2126 6.02055 31.2857 5.27139 31.5648 4.59057C31.8439 3.90975 32.3165 3.32785 32.9229 2.91844C33.5293 2.50903 34.2423 2.29051 34.9716 2.29051C35.9497 2.29051 36.8876 2.68306 37.5792 3.38181C38.2707 4.08055 38.6592 5.02824 38.6592 6.01641Z"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#727272"
            d="M49.2723 3.0731L37.9375 16.8162C36.0937 18.6791 36.1277 24.4512 40.2687 24.4512H64.0718C64.7663 24.4513 65.4468 24.2539 66.0357 23.8817C66.6245 23.5096 67.0978 22.9776 67.4016 22.3466C67.7054 21.7155 67.8274 21.0108 67.7537 20.3131C67.68 19.6153 67.4136 18.9525 66.9848 18.4005L55.0795 3.06929C54.7331 2.62318 54.2908 2.26248 53.7862 2.01443C53.2815 1.76639 52.7277 1.6375 52.1665 1.6375C51.6053 1.6375 51.0514 1.76639 50.5468 2.01443C50.0421 2.26248 49.5999 2.62318 49.2534 3.06929"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="white"
            d="M69.8261 24.6917C69.8268 27.7207 68.9385 30.6818 67.2734 33.2005C65.6083 35.7192 63.2413 37.6824 60.4718 38.8417C57.7022 40.001 54.6546 40.3043 51.7145 39.7133C48.7743 39.1223 46.0737 37.6635 43.9542 35.5215C41.8347 33.3794 40.3916 30.6504 39.8074 27.6795C39.2232 24.7087 39.5242 21.6295 40.6722 18.8315C41.8203 16.0335 43.7639 13.6423 46.2571 11.9606C48.7504 10.2788 51.6812 9.38197 54.679 9.38348C58.6976 9.38348 62.5517 10.9962 65.3936 13.8669C68.2356 16.7377 69.8326 20.6314 69.8336 24.6917"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#282828"
            d="M67.1095 24.6917C67.1102 27.1778 66.3812 29.6082 65.0146 31.6756C63.648 33.7429 61.7053 35.3543 59.4321 36.3058C57.159 37.2574 54.6576 37.5064 52.2444 37.0213C49.8312 36.5362 47.6147 35.3388 45.8751 33.5806C44.1355 31.8224 42.9511 29.5825 42.4718 27.144C41.9924 24.7056 42.2395 22.1783 43.182 19.8819C44.1245 17.5854 45.7198 15.623 47.7663 14.2428C49.8128 12.8626 52.2185 12.1268 54.679 12.1283C57.9771 12.1283 61.1402 13.4518 63.4727 15.8078C65.8052 18.1638 67.116 21.3594 67.117 24.6917"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#444444"
            d="M44.9878 25.6805C44.7283 25.6805 44.4794 25.5763 44.2959 25.3909C44.1124 25.2055 44.0093 24.954 44.0093 24.6917C44.0123 21.8342 45.1376 19.0946 47.1382 17.0747C49.1387 15.0548 51.8509 13.9197 54.6791 13.9187C54.9386 13.9187 55.1875 14.0229 55.3711 14.2083C55.5546 14.3937 55.6577 14.6452 55.6577 14.9074C55.6577 15.1697 55.5546 15.4211 55.3711 15.6066C55.1875 15.792 54.9386 15.8962 54.6791 15.8962C52.3762 15.9022 50.1693 16.8292 48.5409 18.4745C46.9125 20.1198 45.9951 22.3496 45.9891 24.6765C45.9891 24.9387 45.886 25.1902 45.7025 25.3756C45.5189 25.561 45.27 25.6652 45.0105 25.6652"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#727272"
            d="M20.5499 3.07311L31.8847 16.8162C33.7285 18.6791 33.6907 24.4512 29.5498 24.4512H5.74668C5.05216 24.4513 4.37162 24.2539 3.78281 23.8818C3.194 23.5096 2.72066 22.9776 2.41686 22.3466C2.11305 21.7155 1.99103 21.0109 2.06473 20.3131C2.13843 19.6153 2.40488 18.9525 2.83364 18.4005L14.739 3.06929C15.085 2.62324 15.5269 2.26255 16.0313 2.01451C16.5356 1.76647 17.0892 1.63757 17.6501 1.63757C18.211 1.63757 18.7646 1.76647 19.269 2.01451C19.7733 2.26255 20.2152 2.62324 20.5613 3.06929"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="white"
            d="M4.71208e-07 24.6917C-0.000746839 27.7204 0.887417 30.6812 2.55217 33.1997C4.21693 35.7183 6.5835 37.6815 9.35258 38.841C12.1217 40.0005 15.1689 40.3043 18.1088 39.7139C21.0488 39.1235 23.7494 37.6655 25.8692 35.5242C27.989 33.3829 29.4327 30.6546 30.0178 27.6842C30.6028 24.7138 30.3029 21.6349 29.156 18.8368C28.0091 16.0386 26.0667 13.647 23.5745 11.9643C21.0822 10.2816 18.1521 9.38348 15.1546 9.38348C11.136 9.38348 7.28196 10.9962 4.44003 13.8669C1.59809 16.7377 0.00100237 20.6314 4.71208e-07 24.6917"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#282828"
            d="M2.71655 24.6917C2.71581 27.1775 3.44465 29.6076 4.8109 31.6748C6.17716 33.742 8.11946 35.3533 10.3921 36.3051C12.6648 37.2569 15.1658 37.5063 17.5788 37.0218C19.9918 36.5373 22.2084 35.3407 23.9483 33.5833C25.6882 31.8259 26.8732 29.5866 27.3534 27.1487C27.8336 24.7108 27.5875 22.1837 26.6462 19.8871C25.7049 17.5906 24.1107 15.6276 22.0652 14.2465C20.0197 12.8654 17.6148 12.1283 15.1546 12.1283C11.8565 12.1283 8.69338 13.4518 6.36091 15.8078C4.02843 18.1638 2.71756 21.3594 2.71655 24.6917"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#444444"
            d="M5.4671 25.6805C5.20822 25.6795 4.96028 25.5748 4.77758 25.3895C4.59488 25.2042 4.49231 24.9533 4.49231 24.6917C4.49531 21.8355 5.61961 19.0971 7.61852 17.0774C9.61744 15.0577 12.3277 13.9217 15.1546 13.9187C15.4141 13.9187 15.663 14.0229 15.8465 14.2083C16.03 14.3937 16.1331 14.6452 16.1331 14.9074C16.1331 15.1697 16.03 15.4211 15.8465 15.6066C15.663 15.792 15.4141 15.8962 15.1546 15.8962C12.8487 15.8982 10.6376 16.8233 9.00531 18.4689C7.37305 20.1146 6.45266 22.3466 6.44567 24.6765C6.44567 24.9387 6.34257 25.1902 6.15906 25.3756C5.97554 25.561 5.72663 25.6652 5.4671 25.6652"
          ></path>
          <path
            fill="currentColor"
            d="M248.961 38.4844C255.875 38.4844 262 34.3539 262 27.7114C262 22.5654 258.426 19.2327 253.03 16.9383C249.305 15.3617 246.864 14.8425 246.864 13.243C246.864 12.0519 248.213 11.0784 250.099 11.0784C251.746 11.0784 254.398 11.8801 255.426 13.7163L260.715 8.57032C259.367 5.13455 255.256 2.62261 249.989 2.62261C243.437 2.62261 237.766 6.92496 237.766 12.9605C237.766 18.2172 241.514 21.1147 245.878 23.0196C249.279 24.5467 252.796 26.1118 252.796 27.9061C252.796 29.3338 250.888 30.0477 248.942 30.0477C246.052 30.0477 243.373 28.7498 241.941 26.6119L236.414 32.1015C238.129 35.9534 243.29 38.4844 248.961 38.4844ZM218.569 19.2098H214.696V11.6854H218.569C221.01 11.6854 222.767 13.285 222.767 15.4037C222.767 17.5224 221.032 19.2327 218.569 19.2098V19.2098ZM214.696 38.0072V27.7343H218.569C225.808 27.7343 231.608 22.0882 231.608 15.3617C231.608 8.54742 225.68 3.14562 218.569 3.14562H205.534V38.0111L214.696 38.0072ZM191.947 39.2403C195.03 39.2403 197.615 36.7971 197.615 33.8538C197.615 30.9105 195.023 28.5092 191.947 28.5092C188.872 28.5092 186.28 30.9525 186.28 33.8538C186.272 36.8391 188.807 39.2403 191.947 39.2403ZM180.435 38.0072V29.3109H167.211V3.1418H158.064V38.0072H180.435ZM131.933 30.0477C126.451 30.0477 122.257 25.9171 122.257 20.5535C122.257 15.1899 126.451 11.0097 131.933 11.0097C137.415 11.0097 141.609 15.1632 141.609 20.5535C141.609 25.9439 137.423 30.0477 131.933 30.0477ZM131.911 38.8929C142.66 38.8929 150.877 30.9983 150.877 20.6184C150.877 10.147 142.66 2.21033 131.933 2.21033C121.207 2.21033 112.985 10.147 112.985 20.6032C112.985 30.9983 121.176 38.8929 131.911 38.8929V38.8929ZM108.432 38.0072V29.3109H95.2085V3.1418H86.0613V38.0072H108.432Z"
          ></path>
        </svg>
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

                          <i className={`bx ${item.icon}`} />
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
