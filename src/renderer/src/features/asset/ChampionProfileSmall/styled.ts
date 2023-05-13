import styled from 'styled-components'

export const ChampionProfileSmallStyled = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;

  .profileImage {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    position: relative;
    margin-right: 1rem;

    .imageMask {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        transform: scale(1.25);
        object-fit: cover;
      }
    }

    .tier {
      position: absolute;
      z-index: 1;
      top: -4px;
      left: -4px;
    }

    .honey {
      position: absolute;
      z-index: 1;
      bottom: -4px;
      left: -4px;
      width: 20px;
      height: 20px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .op {
      position: absolute;
      z-index: 1;
      top: 0px;
      right: -10px;
    }
  }
`
