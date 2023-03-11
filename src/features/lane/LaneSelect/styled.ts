import styled from 'styled-components';

export const LaneSelectStyled = styled.div`
  .ant-radio-button-wrapper {
    height: 2.6rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;

    span {
      display: flex;
      align-items: center;
      justify-content: space-between;
      opacity: 0.7;
      transition: 250ms opacity;

      svg {
        width: 20px;
      }
    }

    small {
      font-size: 0.85rem;
      transform: translateY(1px);
      padding-right: 0.2rem;
      margin-left: 0.5rem;
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
