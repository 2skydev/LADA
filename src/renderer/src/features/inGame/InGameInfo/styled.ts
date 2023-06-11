import { darken, lighten } from 'polished'
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
    background-color: rgba(0, 0, 0, 0.2);
    padding: 1rem;
    border-radius: 8px;
    gap: 1rem;

    .team {
      width: 50%;

      &.myTeam {
        .player {
          .championProfile {
            border-color: ${props => props.theme.colors.blue};
          }
        }
      }

      > .header {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0.8rem;

        .title {
          color: ${props => lighten(0.1, props.theme.colors.textColor2)};
          font-size: 0.8rem;
        }

        .title:nth-child(1) {
          width: 250px;
        }

        .title:nth-child(2) {
          width: 100px;
          text-align: center;
        }

        .title:nth-child(4) {
          width: 90px;
          text-align: right;
        }
      }

      .player {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0.8rem;
        border-radius: 6px;
        background-color: ${props => darken(0.015, props.theme.colors.contentBG)};

        &.self {
          .summaryText {
            .summonerName {
              color: ${props => props.theme.colors.primary};
            }
          }
        }

        + .player {
          margin-top: 0.5rem;
        }

        .playerSummary {
          display: flex;
          align-items: center;
        }

        .spells {
          margin-right: 0.5rem;

          .DataDragonImage {
            width: 20px;
            height: 20px;
            border-radius: 4px;

            + .DataDragonImage {
              margin-top: 0.3rem;
            }
          }
        }

        .championProfile {
          border-radius: 50%;
          border: 2px solid ${props => props.theme.colors.red};
          padding: 3px;
          margin-right: 0.8rem;
          position: relative;

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
          }

          .championStat {
            color: ${props => lighten(0.1, props.theme.colors.textColor2)};
            font-size: 0.75rem;

            .winRate {
              font-weight: bold;
              color: ${props => lighten(0.2, props.theme.colors.textColor2)};

              &.high {
                color: ${props => props.theme.colors.error};
              }
            }

            .kda {
              font-size: 0.7rem;
              margin-top: -0.2rem;

              .value {
                font-weight: bold;
                color: ${props => lighten(0.2, props.theme.colors.textColor2)};

                &.green {
                  color: ${props => props.theme.colors.green};
                }

                &.orange {
                  color: ${props => props.theme.colors.orange};
                }
              }
            }
          }
        }

        .seasonStat {
          display: flex;
          align-items: center;

          .left {
            display: flex;
            flex-direction: column;
            align-items: center;

            .RankIcon {
              height: 1.5rem;
            }

            .tier {
              font-size: 0.75rem;
            }
          }

          .right {
            text-align: center;
            width: 4rem;
            margin-left: 0.8rem;

            .gameCount {
              font-size: 0.75rem;
              color: ${props => lighten(0.1, props.theme.colors.textColor2)};
            }
          }
        }

        .runes {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;

          .main,
          .sub,
          .shard {
            display: flex;
            justify-content: flex-end;
            gap: 0.2rem;
          }
        }
      }
    }
  }
`
