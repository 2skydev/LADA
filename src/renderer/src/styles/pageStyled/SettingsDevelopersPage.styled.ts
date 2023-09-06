import styled from 'styled-components'

export const Root = styled.div`
  .date {
    > span {
      color: ${props => props.theme.colors.textColor2};
    }
  }

  .logs {
    margin-top: 1rem;
  }
`
