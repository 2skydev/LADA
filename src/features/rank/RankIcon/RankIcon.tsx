import { ReactNode } from 'react';

import clsx from 'clsx';

import bronzeImage from '~/assets/images/rank/bronze.png';
import challengerImage from '~/assets/images/rank/challenger.png';
import diamondImage from '~/assets/images/rank/diamond.png';
import goldImage from '~/assets/images/rank/gold.png';
import grandmasterImage from '~/assets/images/rank/grandmaster.png';
import ironImage from '~/assets/images/rank/iron.png';
import masterImage from '~/assets/images/rank/master.png';
import platinumImage from '~/assets/images/rank/platinum.png';
import silverImage from '~/assets/images/rank/silver.png';
import unrankedImage from '~/assets/images/rank/unranked.png';

import { RankIconStyled } from './styled';

const RANK_IMAGES = {
  IRON: ironImage,
  BRONZE: bronzeImage,
  SILVER: silverImage,
  GOLD: goldImage,
  PLATINUM: platinumImage,
  DIAMOND: diamondImage,
  MASTER: masterImage,
  GRANDMASTER: grandmasterImage,
  CHALLENGER: challengerImage,
  UNRANKED: unrankedImage,
};

export type Rank = keyof typeof RANK_IMAGES;

export interface RankIconProps {
  className?: string;
  rank: Rank;
}

const RankIcon = ({ className, rank }: RankIconProps) => {
  return (
    <RankIconStyled className={clsx('RankIcon', className)} src={RANK_IMAGES[rank]} alt={rank} />
  );
};

export default RankIcon;
