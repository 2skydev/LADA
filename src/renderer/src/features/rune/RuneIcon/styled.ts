import styled from 'styled-components'

import ringHoverImage from '@renderer/assets/images/rune/ring-hover.svg'
import ringImage from '@renderer/assets/images/rune/ring.svg'
import { RuneIconProps } from '@renderer/features/rune/RuneIcon/RuneIcon'

export interface RuneIconStyledProps extends Pick<RuneIconProps, 'size'> {}

export const RuneIconStyled = styled.div<RuneIconStyledProps>`
  width: ${props => props.size};
  height: ${props => props.size};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e2328;
  border-radius: 50%;

  &.clickable {
    cursor: pointer;
    transition: filter 150ms, opacity 150ms;

    &:hover {
      filter: none;
      opacity: 1;
    }
  }

  &:not(.active) {
    filter: grayscale(100%);
    opacity: 0.5;
  }

  .DataDragonImage {
    width: calc(100% - 4px);
    height: calc(100% - 4px);
  }

  &.imageOnly {
    background: none;

    .DataDragonImage {
      width: 100%;
      height: 100%;
    }
  }

  &.largeImage {
    .DataDragonImage {
      position: absolute;
      z-index: 2;
      width: 175%;
      height: 175%;
      left: calc(50% - 175% * 0.5);
      top: calc(50% - 175% * 0.5);
    }
  }

  .ring {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    mask-image: url('${ringImage}');
    transition: transform 150ms, opacity 150ms;
    pointer-events: none;

    &.hover {
      width: calc(100% + 4px * 2 + 3px * 2);
      height: calc(100% + 4px * 2 + 3px * 2);
      mask-image: url('${ringHoverImage}');
      transform: scale(1.1);
      top: -7px;
      left: -7px;
      opacity: 0;
    }
  }

  &.clickable:hover {
    .ring.hover {
      transform: scale(1);
      opacity: 0.5;
    }
  }

  &[data-category='Precision'] .ring,
  &[data-category='Shard'] .ring {
    background: linear-gradient(to bottom, #aea789 0%, #c8aa6e 100%);
  }

  &[data-category='Domination'] .ring {
    background: linear-gradient(to bottom, #d44242 0%, #dc4747 100%);
  }

  &[data-category='Sorcery'] .ring {
    background: linear-gradient(to bottom, #9faafc 0%, #6c75f5 100%);
  }

  &[data-category='Resolve'] .ring {
    background: linear-gradient(to bottom, #a1d586 0%, #a4d08d 100%);
  }

  &[data-category='Inspiration'] .ring {
    background: linear-gradient(to bottom, #49aab9 0%, #48b4be 100%);
  }
`
