import styled from 'styled-components'

export const Root = styled.div`
  > .version {
    margin-bottom: 1rem;

    span {
      color: ${props => props.theme.colors.textColor2};
    }
  }

  > .description {
    color: ${props => props.theme.colors.textColor2};
    white-space: pre-wrap;

    .ant-btn {
      display: block;
      margin-top: 1rem;
      width: 20rem;
    }
  }
`
