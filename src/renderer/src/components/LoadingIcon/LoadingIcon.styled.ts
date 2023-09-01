import styled from 'styled-components'

export const Root = styled.div`
  display: flex !important;

  @keyframes LoadingIconAnimation {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    50% {
      opacity: 0.5;
      transform: translateY(2px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  > div {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};

    & + div {
      margin-left: 5px;
    }

    &:nth-child(1) {
      animation: LoadingIconAnimation 1.5s infinite;
    }

    &:nth-child(2) {
      animation: LoadingIconAnimation 1.5s infinite;
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation: LoadingIconAnimation 1.5s infinite;
      animation-delay: 0.4s;
    }
  }
`
