import { darken } from 'polished'
import styled from 'styled-components'

export const Root = styled.div`
  margin-top: -1rem;

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

    + section {
      margin-top: 0.8rem;
    }
  }

  .arguments {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .summary {
    display: flex;
    gap: 1rem;
    position: relative;
    align-items: flex-start;

    .loadingOverlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 8px;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .imageGroup {
      .title {
        color: ${props => props.theme.colors.textColor2};
        margin-bottom: 0.5rem;
        font-size: 0.85rem;
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
    }

    .champion {
      display: flex;
      position: relative;

      .noData {
        display: flex;
        align-items: center;
        margin-top: 2rem;

        .bx {
          font-size: 2.5rem;
          color: ${props => props.theme.colors.error};
        }

        .texts {
          margin-left: 1rem;

          h3 {
            margin-bottom: 0.1rem;
            line-height: 1;
          }

          p {
            font-size: 0.8rem;
            color: ${props => props.theme.colors.textColor2};
            margin-bottom: 0;
          }
        }
      }

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

      > .right {
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

        .spellAndSkill {
          display: flex;

          .spell {
            margin-right: 4rem;
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
                  line-height: 0;
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

    .itemGroups {
      display: flex;
      gap: 0.5rem;
      margin-top: -1.8rem;

      .imageGroup {
        padding: 0.8rem 1rem;
        border-radius: 8px;
        background-color: ${props => darken(0.015, props.theme.colors.contentBG)};

        &:nth-child(1) {
          flex: 1;
        }

        &:nth-child(2) {
          flex: 1;
        }

        &:nth-child(3) {
          flex: 2;
        }
      }
    }

    > .runeContainer {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 1rem;
      border-radius: 8px;
      background-color: ${props => darken(0.015, props.theme.colors.contentBG)};
    }
  }

  .counter {
    padding-bottom: 0;

    .title {
      margin-bottom: 0.8rem;
    }

    .championList {
      display: flex;
      overflow-x: auto;
      gap: 1rem 2.5rem;
      width: 100%;
      padding-bottom: 1rem;

      .item {
        display: flex;
        align-items: center;

        .imageMask {
          width: 40px;
          height: 40px;
          overflow: hidden;
          border-radius: 50%;

          img {
            width: 100%;
            height: 100%;
            transform: scale(1.1);
          }
        }

        .texts {
          font-size: 0.7rem;
          margin-left: 0.5rem;
          line-height: 1.3;

          .value {
            &.up {
              color: ${props => props.theme.colors.blue};
            }

            &.down {
              color: ${props => props.theme.colors.error};
            }
          }
        }
      }
    }
  }
`
