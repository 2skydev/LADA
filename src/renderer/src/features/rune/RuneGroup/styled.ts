import styled from 'styled-components'

export const RuneGroupStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &.shard {
    gap: 0.8rem;
  }

  .slot {
    display: flex;
    width: 198px;
    justify-content: space-around;
    position: relative;
  }
`
