import styled from 'styled-components';

import { DataDragonImageProps } from './DataDragonImage';

export interface DataDragonImageStyledProps extends Pick<DataDragonImageProps, 'size' | 'circle'> {}

export const DataDragonImageStyled = styled.img<DataDragonImageStyledProps>`
  display: block;
  ${props => props.circle && 'border-radius: 50%;'}
  ${props =>
    props.size &&
    `
    width: ${props.size};
    height: ${props.size};
  `}
`;
