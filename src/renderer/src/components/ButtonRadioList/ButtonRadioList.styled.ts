import { darken, lighten } from 'polished'
import styled from 'styled-components'

export const Root = styled.div`
  > .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    border-radius: 8px;
    background-color: ${props => darken(0.07, props.theme.colors.contentBG)};
    cursor: pointer;
    border: 1px solid transparent;
    transition: 250ms border-color, 250ms background-color;

    + .item {
      margin-top: 0.3rem;
    }

    &.checked {
      background-color: ${props => lighten(0.04, props.theme.colors.contentBG)};
      border-color: ${props => props.theme.colors.textColor2};

      > .radioIcon {
        opacity: 1;

        &::before {
          transform: scale(0.5);
        }
      }
    }

    > .label {
      display: flex;
      align-items: center;
    }

    > .radioIcon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 1px solid white;
      margin-right: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: opacity 250ms;
      opacity: 0.5;

      &::before {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: white;
        transform-origin: center;
        transition: transform 250ms;
        transform: scale(0);
      }
    }
  }
`
