import styled from 'styled-components'

export const RankingVariationStyled = styled.div`
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  padding-right: 8px;
  border-radius: 8px;
  gap: 4px;
  font-size: 12px;
  font-weight: bold;
  color: rgb(130, 139, 149);
  background-color: rgb(130, 139, 149, 0.2);

  svg {
    width: 16px;
    height: 16px;
  }

  &.isDown {
    color: rgb(235, 87, 87);
    background-color: rgba(235, 87, 87, 0.2);
  }

  &.isUp {
    color: rgb(0, 180, 128);
    background-color: rgba(0, 180, 128, 0.2);
  }
`
