import styled from 'styled-components'

export const Root = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors.sidebarBG};
  border-radius: 6px;
  color: ${props => props.theme.colors.textColor2};

  .ReactVirtualized__List {
    overflow-x: auto !important;
    width: auto !important;

    .ReactVirtualized__Grid__innerScrollContainer {
      overflow: initial !important;
      max-width: initial !important;
    }
  }

  > .path {
    font-weight: bold;
  }

  > .ant-divider {
    margin: 0.8rem 0 1rem;
  }
`
