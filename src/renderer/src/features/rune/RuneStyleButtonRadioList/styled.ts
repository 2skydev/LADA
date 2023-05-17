import { darken } from 'polished'
import styled from 'styled-components'

export const RuneStyleButtonRadioListStyled = styled.div`
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

    .texts {
      font-size: 12px;

      > div > span {
        color: ${props => props.theme.colors.textColor2};
      }

      .ant-progress {
        transform: translateY(1px);
      }

      .ant-progress-circle-path,
      .ant-progress-circle-trail {
        stroke: ${props => props.theme.colors.primary};
      }

      .ant-progress-circle-trail {
        opacity: 0.1;
      }
    }
  }
`
