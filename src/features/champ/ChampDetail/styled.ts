import styled from 'styled-components';

export const ChampDetailStyled = styled.div`
  .loadingArea {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50vh;
  }

  section {
    padding: 1rem;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .argments {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .championSection {
    display: flex;

    .championImageContainer {
      width: 150px;
      height: 200px;
      position: relative;
      transform: translate(-1rem, -3rem);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
      border-radius: 8px;

      .TierIcon {
        position: absolute;
        width: 34px;
        left: -10px;
        top: -10px;
        z-index: 1;
      }

      .HoneyIcon {
        position: absolute;
        width: 35px;
        right: -20px;
        bottom: 50px;
        z-index: 1;
      }

      .OpIcon {
        position: absolute;
        width: 40px;
        right: -20px;
        bottom: 20px;
        z-index: 1;
      }

      .imageOverflowBox {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 8px;

        .championImage {
          width: 100%;
          transform: translateY(-10px);
        }
      }
    }

    .right {
      margin-left: 1rem;
      padding-top: 0.8rem;

      .championName {
        display: flex;
        align-items: flex-end;
        font-size: 1.4rem;

        span {
          margin-left: 1rem;
          font-size: 0.85rem;
          color: ${props => props.theme.colors.textColor2};
          transform: translateY(-3px);
        }
      }

      .spellskill {
        display: flex;

        .title {
          color: ${props => props.theme.colors.textColor2};
          margin-bottom: 0.5rem;
        }

        .images {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          img {
            width: 30px;
            height: 30px;
            border-radius: 5px;
          }

          .bx {
            color: ${props => props.theme.colors.textColor2};
          }
        }

        .spell {
          margin-right: 5rem;
        }

        .skill {
          .images {
            .skillImageContainer {
              width: 30px;
              height: 30px;
              position: relative;
              border-radius: 5px;
              overflow: hidden;

              .label {
                width: 1.1rem;
                height: 1.1rem;
                position: absolute;
                right: 0;
                bottom: 0;
                font-size: 0.7rem;
                background-color: rgba(0, 0, 0, 0.9);
                border-top-left-radius: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }
          }

          .skillList {
            display: flex;
            gap: 0.15rem;
            margin-top: 0.5rem;

            .item {
              width: 26px;
              height: 26px;
              border-radius: 5px;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: ${props => props.theme.colors.contentBG};
              font-size: 0.85rem;
              font-weight: bold;

              span {
                transform: translateY(1px);
              }

              &.Q {
                color: #2793cf;
              }

              &.W {
                color: #00b480;
              }

              &.E {
                color: #f97c49;
              }

              &.R {
                background-color: ${props => props.theme.colors.primary};
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
`;
