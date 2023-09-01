import styled from 'styled-components'

export const Root = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;

  .name {
    margin-left: 1rem;
  }

  .profileImage {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    position: relative;

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

    .TierIcon {
      position: absolute;
      z-index: 1;
      top: -4px;
      left: -4px;
      width: 18px;
    }

    .HoneyIcon {
      position: absolute;
      z-index: 1;
      bottom: -4px;
      left: -4px;
      width: 20px;
      height: 20px;
    }

    .OpIcon {
      position: absolute;
      z-index: 1;
      top: 0px;
      right: -10px;
      width: 22px;
    }
  }
`
