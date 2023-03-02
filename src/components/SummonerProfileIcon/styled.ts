import styled from 'styled-components';

import { SummonerProfileIconProps } from './SummonerProfileIcon';

export interface SummonerProfileIconStyledProps extends Pick<SummonerProfileIconProps, 'size'> {}

export const SummonerProfileIconStyled = styled.img<SummonerProfileIconStyledProps>`
  display: block;
  border-radius: 50%;
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
`;
