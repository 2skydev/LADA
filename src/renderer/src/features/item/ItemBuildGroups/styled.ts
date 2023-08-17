import { darken } from 'polished'
import styled from 'styled-components'

const maxHeight = '220px'

export const ItemBuildGroupsStyled = styled.div`
  margin-top: 0.5rem;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  background-color: ${props => darken(0.015, props.theme.colors.contentBG)};

  .title {
    color: ${props => props.theme.colors.textColor2};
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
  }

  .content {
    display: flex;

    .ButtonRadioList {
      width: 200px;
      height: ${maxHeight};
      padding-right: 0.5rem;
      overflow-y: auto;
      margin-right: 1rem;

      .label {
        img {
          margin-right: 0.5rem;
          width: 34px;
          height: 34px;
          object-fit: cover;
        }
      }
    }

    img {
      border-radius: 4px;

      &.mythical {
        border-radius: 50%;
        border: 1px solid ${props => props.theme.colors.error};
      }
    }

    .list {
      height: ${maxHeight};
      overflow-y: auto;
      padding-right: 0.5rem;
      flex: 1;

      > .item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
      }

      .images {
        display: flex;
        align-items: center;

        img {
          width: 30px;
          height: 30px;
          object-fit: cover;
        }

        .bx {
          margin: 0 0.2rem;
          font-size: 1.2rem;
          opacity: 0.75;
        }
      }
    }
  }
`
