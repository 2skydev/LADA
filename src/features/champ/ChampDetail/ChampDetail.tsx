import { Result } from 'antd';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import LoadingIcon from '~/components/LoadingIcon';
import useAPI from '~/hooks/useAPI';

import { ChampDetailStyled } from './styled';

export interface ChampDetailProps {
  className?: string;
  champId: number;
}

const ChampDetail = ({ className, champId }: ChampDetailProps) => {
  const { data } = useAPI('ps', `/champ/${champId}`);

  const champSummary = data ? data.champ.champSummary[0] : null;

  return (
    <ChampDetailStyled className={clsx('ChampDetail', className)}>
      {!data && (
        <div className="loadingArea">
          <LoadingIcon />
        </div>
      )}

      {data && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header></header>
        </motion.div>
      )}
    </ChampDetailStyled>
  );
};

export default ChampDetail;
