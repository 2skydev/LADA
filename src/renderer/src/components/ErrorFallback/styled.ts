import { motion } from 'framer-motion'
import { darken } from 'polished'
import styled from 'styled-components'

export const ErrorFallbackStyled = styled(motion.div)`
  color: ${props => props.theme.colors.textColor1};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  text-align: center;
  background-color: ${props => darken(0.06, props.theme.colors.contentBG)};

  .Titlebar {
    position: absolute;
    top: 0;
    left: 0;
  }

  img {
    width: 200px;
  }

  h1 {
    font-size: 1.2rem;
  }

  p {
    color: ${props => darken(0.3, props.theme.colors.textColor1)};
    font-size: 0.9rem;
  }

  .ant-btn {
  }

  .error {
    margin-top: 3rem;

    .title {
      color: ${props => props.theme.colors.textColor2};
      margin-bottom: 0.2rem;
    }

    .content {
      color: ${props => props.theme.colors.textColor2};
      font-size: 0.85rem;
      user-select: text;
    }
  }
`
