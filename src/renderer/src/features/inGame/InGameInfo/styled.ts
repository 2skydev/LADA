import { darken, lighten, rgba } from 'polished'
import styled from 'styled-components'

export const InGameInfoStyled = styled.div`
  > header {
    margin-bottom: 2rem;
    line-height: 1;

    h2 {
      margin-bottom: 0.6rem;
      margin-right: 1rem;
    }

    .summaryProperties {
      display: flex;
      font-size: 0.8rem;
      color: ${props => props.theme.colors.textColor2};
    }
  }

  .teams {
    display: flex;
    border-radius: 8px;
    gap: 1rem;

    .team {
      width: 50%;

      &.myTeam {
        > .header {
          background-color: ${props => rgba(props.theme.colors.blue, 0.5)};
        }

        .player {
          .championProfile {
            border-color: ${props => props.theme.colors.blue};
          }
        }
      }

      &:not(.myTeam) {
        > .header {
          background-color: ${props => rgba(props.theme.colors.red, 0.5)};
        }
      }

      > .header {
        display: flex;
        justify-content: space-between;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        margin-bottom: 0.5rem;

        .title {
          color: ${props => lighten(0.1, props.theme.colors.textColor1)};
          font-size: 0.8rem;
        }

        .title:nth-child(1) {
          width: 250px;
        }

        .title:nth-child(2) {
          width: 7rem;
          text-align: center;
        }

        .title:nth-child(3) {
          width: 10rem;
          text-align: center;
        }

        .title:nth-child(4) {
          width: 120px;
          text-align: right;
        }
      }

      > .item {
        + .item {
          margin-top: 0.5rem;
        }

        .player {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.8rem;
          border-radius: 6px;
          background-color: ${props => darken(0.03, props.theme.colors.contentBG)};

          &.self {
            .summaryText {
              .summonerName {
                color: ${props => props.theme.colors.primary};
              }
            }
          }

          .playerSummary {
            .top {
              display: flex;
              align-items: center;

              .spells {
                margin-right: 0.5rem;

                .DataDragonImage {
                  width: 20px;
                  height: 20px;
                  border-radius: 3px;

                  + .DataDragonImage {
                    margin-top: 0.2rem;
                  }
                }
              }

              .championProfile {
                border-radius: 50%;
                border: 2px solid ${props => props.theme.colors.red};
                padding: 3px;
                margin-right: 0.8rem;
                position: relative;
                cursor: pointer;

                .laneIconContainer {
                  position: absolute;
                  border-radius: 50%;
                  width: 20px;
                  height: 20px;
                  background-color: ${props => props.theme.colors.formFieldBG};
                  right: -4px;
                  bottom: -4px;
                  z-index: 1;
                  display: flex;
                  justify-content: center;
                  align-items: center;

                  .LaneIcon {
                    height: 14px;
                  }
                }
              }

              .summaryText {
                width: 10rem;

                .summonerName {
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                  padding-right: 1rem;
                  font-size: 0.85rem;

                  span {
                    cursor: pointer;
                    transition: 150ms color;

                    &:hover {
                      color: ${props => props.theme.colors.blue};
                    }

                    .bx {
                      transform: translateY(1px);
                      margin-right: 0.2rem;
                    }
                  }
                }

                .championStat {
                  color: ${props => lighten(0.1, props.theme.colors.textColor2)};
                  font-size: 0.7rem;
                  display: flex;
                  align-items: center;

                  .winRate {
                    font-weight: bold;
                    color: ${props => lighten(0.2, props.theme.colors.textColor2)};

                    &.high {
                      color: ${props => props.theme.colors.green};
                    }
                  }

                  .ant-divider {
                    height: 0.4rem;
                  }

                  .kda {
                    .value {
                      font-weight: bold;
                      color: ${props => lighten(0.2, props.theme.colors.textColor2)};

                      &.green {
                        color: ${props => props.theme.colors.green};
                      }
                    }
                  }
                }
              }
            }

            .bottom {
              margin-top: 0.3rem;

              .recentMatches {
                display: flex;
                align-items: center;
                gap: 1px;

                .item {
                  border-bottom: 3px solid ${props => props.theme.colors.red};

                  &.win {
                    border-color: ${props => props.theme.colors.green};
                  }

                  .ChampionImage {
                    width: 16px;
                    height: 16px;
                  }

                  &:nth-child(7) {
                    opacity: 0.8;
                  }

                  &:nth-child(8) {
                    opacity: 0.6;
                  }

                  &:nth-child(9) {
                    opacity: 0.5;
                  }

                  &:nth-child(10) {
                    opacity: 0.25;
                  }
                }
              }
            }
          }

          .seasonStat {
            display: flex;
            align-items: center;
            flex-direction: column;

            .top {
              display: flex;
              flex-direction: column;
              align-items: center;

              .RankIcon {
                height: 1.5rem;
                margin-bottom: 0.1rem;
              }

              .tier {
                font-size: 0.75rem;

                span {
                  opacity: 0.6;
                }
              }
            }

            .bottom {
              display: flex;
              text-align: center;
              width: 7rem;
              font-size: 0.75rem;
              color: ${props => lighten(0, props.theme.colors.textColor2)};
              gap: 0.5rem;
              justify-content: center;

              .winRate {
                &.green {
                  color: ${props => props.theme.colors.green};
                }

                &.red {
                  color: ${props => props.theme.colors.red};
                }
              }
            }
          }

          .psScore {
            color: ${props => props.theme.colors.textColor2};
            font-size: 1.4rem;
            font-weight: bold;
            text-align: center;
            width: 10rem;

            &.high {
              color: ${props => lighten(0.1, props.theme.colors.green)};
            }
          }

          .runes {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            width: 120px;

            .main,
            .sub,
            .shard {
              display: flex;
              justify-content: space-between;
              gap: 0.2rem;
            }

            .main {
              .RuneIcon:first-child {
                margin-right: 0.5rem;
              }
            }

            .shard {
              gap: 0.1rem;
              padding-right: 0.2rem;
            }

            .bottom {
              display: flex;
              align-items: center;
              justify-content: space-between;
              /* flex-direction: row-reverse; */
            }
          }
        }

        .tags {
          /* padding: 0.4rem 0.8rem;
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
          background-color: ${props => darken(0.03, props.theme.colors.contentBG)};
          border-top: 1px solid ${props => props.theme.colors.borderColor};
          display: flex;
          justify-content: space-between; */

          .ant-tag {
            font-size: 0.6rem;
            line-height: 18px;
            padding-inline: 0.3rem;
            border: none;

            &.green {
              background-color: ${props => rgba(props.theme.colors.green, 0.2)};
              /* border-color: ${props => rgba(props.theme.colors.green, 0.5)}; */
            }

            &.red {
              background-color: ${props => rgba(props.theme.colors.red, 0.2)};
              /* border-color: ${props => rgba(props.theme.colors.red, 0.5)}; */
            }
          }
        }
      }
    }
  }
`
