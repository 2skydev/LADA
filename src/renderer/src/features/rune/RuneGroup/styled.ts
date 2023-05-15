import styled from 'styled-components'

import keystoneBorderImage from '@renderer/assets/images/rune/keystone-border.svg'

// const runeColors = {
//   Precision: '#c8aa6e',
//   Domination: '#dc4747',
//   Sorcery: '#6c75f5',
//   Resolve: '#a4d08d',
//   Inspiration: '#48b4be',
// }

export const RuneGroupStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &.shard {
    gap: 0.8rem;
  }

  .slot {
    display: flex;
    width: 198px;
    justify-content: space-around;
    position: relative;
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
      width: 250px;
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
      width: 250px;
      mask-image: url('${keystoneBorderImage}');
      transform: scaleY(-1);
      bottom: -5px;
    } */
  }
`
