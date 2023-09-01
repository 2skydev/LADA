import { rgba } from 'polished'
import styled from 'styled-components'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;

  img {
    height: 100px;
    margin-bottom: 2rem;
  }

  .text {
    color: white;
    font-size: 1rem;
  }

  .ant-progress {
    width: 200px;

    .ant-progress-bg {
      background-color: #8e88ea !important;
    }

    .ant-progress-inner {
      background-color: ${rgba('#8e88ea', 0.2)} !important;
    }
  }
`
