import styled from 'styled-components'

export const ReadyTimerOverlayStyled = styled.div`
  position: absolute;
  top: calc(50% + 100px);
  left: calc(50%);
  transform: translate(-50%, -50%);
  color: ${props => props.theme.colors.gold};
  text-align: center;
  font-family: 'BeaufortforLOL';

  span {
    font-family: 'NanumSquareRound';
    transform: translateY(-1px);
  }
`
