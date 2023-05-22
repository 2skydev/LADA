import { darken } from 'polished'
import styled from 'styled-components'

export const ItemBuildsStyled = styled.div`
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
      height: 260px;
      padding-right: 0.5rem;
      overflow-y: auto;
      margin-right: 1rem;

      .label {
        .image {
          margin-right: 0.5rem;
        }
      }
    }

    .image {
      .DataDragonImage {
        border-radius: 4px;
      }

      &.mythical {
        .DataDragonImage {
          border-radius: 50%;
          border: 1px solid ${props => props.theme.colors.error};
        }
      }
    }

    .list {
      height: 260px;
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

        .bx {
          margin: 0 0.2rem;
          font-size: 1.2rem;
          opacity: 0.75;
        }
      }
    }
  }
`
