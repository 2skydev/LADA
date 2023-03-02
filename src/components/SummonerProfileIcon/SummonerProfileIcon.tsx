import axios from 'axios';
import clsx from 'clsx';
import useSWRImmutable from 'swr/immutable';

import logoImage from '~/assets/images/logo@256.png';

import { SummonerProfileIconStyled } from './styled';

export interface SummonerProfileIconProps {
  className?: string;
  profileIconId: number;
  size?: string;
}

const SummonerProfileIcon = ({ className, profileIconId, size }: SummonerProfileIconProps) => {
  const { data: versions } = useSWRImmutable(
    'https://ddragon.leagueoflegends.com/api/versions.json',
    {
      fetcher: async url => {
        const { data } = await axios.get(url);
        return data;
      },
    },
  );

  const latestVersion = versions?.[0];

  return (
    <SummonerProfileIconStyled
      className={clsx('SummonerProfileIcon', className)}
      src={
        latestVersion
          ? `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/profileicon/${profileIconId}.png`
          : logoImage
      }
      size={size}
    />
  );
};

export default SummonerProfileIcon;
