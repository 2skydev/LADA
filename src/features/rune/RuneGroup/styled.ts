import styled from 'styled-components';

import keystoneBorderImage from '~/assets/images/rune/keystone-border.svg';
import ringHoverImage from '~/assets/images/rune/ring-hover.svg';
import ringImage from '~/assets/images/rune/ring.svg';

export const RuneGroupStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .slot {
    display: flex;
    gap: 1rem;
    justify-content: center;
    position: relative;

    .rune {
      width: 38px;
      height: 38px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: filter 150ms, opacity 150ms;
      cursor: pointer;
      background: #1e2328;
      border-radius: 50%;

      &:not(.active):not(:hover) {
        filter: grayscale(100%);
        opacity: 0.5;
      }

      .DataDragonImage {
        width: calc(100% - 4px);
        height: calc(100% - 4px);
      }

      .ring {
        position: absolute;
        z-index: 1;
        width: 38px;
        height: 38px;
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

      &:hover {
        .ring.hover {
          transform: scale(1);
          opacity: 0.5;
        }
      }
    }
  }

  &.main .slot:first-child {
    /* &:before {
      background: linear-gradient(to right, transparent 0%, #48b4be 50%, transparent 100%);
      content: '';
      display: block;
      height: 9px;
      left: -15px;
      margin: 0;
      position: absolute;
      width: 286px;
      mask-image: url('${keystoneBorderImage}');
      top: -5px;
    }

    &:after {
      background: linear-gradient(to right, transparent 0%, #48b4be 50%, transparent 100%);
      content: '';
      display: block;
      height: 9px;
      left: -15px;
      margin: 0;
      position: absolute;
      width: 286px;
      mask-image: url('${keystoneBorderImage}');
      transform: scaleY(-1);
      bottom: -5px;
    } */

    .rune {
      .DataDragonImage {
        position: absolute;
        z-index: 2;
        width: 175%;
        height: 175%;
        left: calc(50% - 175% * 0.5);
        top: calc(50% - 175% * 0.5);
      }
    }
  }

  &[data-category='Shard'] {
    .rune {
      width: 28px;
      height: 28px;

      .ring {
        width: 28px;
        height: 28px;
      }
    }
  }

  &[data-category='Precision'] .rune .ring,
  &[data-category='Shard'] .rune .ring {
    background: linear-gradient(to bottom, #aea789 0%, #c8aa6e 100%);
  }

  &[data-category='Domination'] .rune .ring {
    background: linear-gradient(to bottom, #d44242 0%, #dc4747 100%);
  }

  &[data-category='Sorcery'] .rune .ring {
    background: linear-gradient(to bottom, #9faafc 0%, #6c75f5 100%);
  }

  &[data-category='Resolve'] .rune .ring {
    background: linear-gradient(to bottom, #a1d586 0%, #a4d08d 100%);
  }

  &[data-category='Inspiration'] .rune .ring {
    background: linear-gradient(to bottom, #49aab9 0%, #48b4be 100%);
  }
`;
