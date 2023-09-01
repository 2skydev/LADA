import { darken } from 'polished'
import styled from 'styled-components'

export const Root = styled.div`
  flex: 1;
  margin-right: 2rem;
  height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;

  .ButtonRadioList {
    .runeIconBox {
      position: relative;
      margin-right: 0.5rem;

      .sub {
        position: absolute;
        left: 20px;
        top: 20px;
        z-index: 1;
        background-color: ${props => darken(0.1, props.theme.colors.contentBG)};
        padding: 2px;
      }
    }
  }
`
