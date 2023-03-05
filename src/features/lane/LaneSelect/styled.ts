import styled from 'styled-components';

export const LaneSelectStyled = styled.div`
  .ant-radio-button-wrapper {
    padding-right: 1.4rem;
    height: 2.6rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;

    small {
      font-size: 0.85rem;
      transform: translateY(1px);
    }

    span {
      display: flex;
      align-items: center;
      justify-content: space-between;
      opacity: 0.7;
      transition: 250ms opacity;

      svg {
        width: 20px;
        margin-right: 0.5rem;
      }
    }

    &:hover {
      color: white;

      span {
        opacity: 1;
      }
    }

    &-checked {
      background-color: ${props => props.theme.colors.primary};
      color: white;

      span {
        opacity: 1;
      }

      &:hover {
        color: white;
      }
    }

    &:not(:first-child)::before {
      display: none;
    }
  }
`;
