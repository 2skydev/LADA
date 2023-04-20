import styled from 'styled-components'

export const SettingsPageStyled = styled.div`
  .autoAcceptField {
    display: inline-flex;
    align-items: center;

    .delay {
      display: flex;
      align-items: center;
      background: ${props => props.theme.colors.formFieldBG};
      padding: 0.6rem 1rem;
      border-radius: 8px;
      margin-left: 1rem;
      transition: 250ms opacity;

      &.disabled {
        opacity: 0.5;
      }

      .ant-input-number {
        width: 3.5rem;
        margin: 0 0.5rem;
      }
    }
  }
`
