import { useLocation } from 'react-router-dom';

import { Button } from 'antd';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';

import DataDragonImage from '~/features/asset/DataDragonImage';
import useAPI from '~/hooks/useAPI';
import { layoutStore } from '~/stores/layout';

import { ContentStyled } from './styled';

export interface ContentProps {
  className?: string;
  children: React.ReactNode;
}

const Content = ({ className, children }: ContentProps) => {
  const { breadcrumbs } = useRecoilValue(layoutStore);
  const { pathname } = useLocation();

  const { data } = useAPI('league', '/summoner/current', {
    revalidateOnLeagueReconnect: true,
  });

  const { displayName, profileIconId } = data || {};

  return (
    <ContentStyled className={clsx('Content', className)}>
      <div className="header">
        <div className="left">
          <i className="bx bx-hash" />

          <motion.span
            initial={{ opacity: 0, x: 3 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            key={pathname}
          >
            {breadcrumbs.map((text, i) => (
              <span key={text + i}>{text}</span>
            ))}
          </motion.span>
        </div>

        {displayName && (
          <Button
            type="text"
            className="right"
            icon={
              <DataDragonImage type="profileicon" filename={profileIconId} size="28px" circle />
            }
          >
            <span>{displayName}</span>
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
  );
};

export default Content;
