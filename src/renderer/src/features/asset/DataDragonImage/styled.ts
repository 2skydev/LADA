import styled from 'styled-components'

import { DataDragonImageProps } from './DataDragonImage'

export interface DataDragonImageStyledProps extends Pick<DataDragonImageProps, 'size' | 'circle'> {}

export const DataDragonImageStyled = styled.img<DataDragonImageStyledProps>`
  display: block;
  ${props => props.circle && 'border-radius: 50%;'}
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
`
