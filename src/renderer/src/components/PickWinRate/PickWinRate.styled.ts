import styled from 'styled-components'

export const Root = styled.div`
  font-size: 0.7rem;
  line-height: 1.2;

  .label {
    color: ${props => props.theme.colors.textColor2};
    display: inline-block;
    width: calc(0.75rem * 2.6);
  }

  .ant-progress {
    transform: translateY(2px);
    margin-left: 0.3rem;
  }

  .ant-progress-circle-path,
  .ant-progress-circle-trail {
    stroke: ${props => props.theme.colors.primary} !important;
  }

  .ant-progress-circle-trail {
    opacity: 0.1;
  }

  .ant-progress-text {
    transform: translateY(-50%) scale(0.8) !important;
  }
`
