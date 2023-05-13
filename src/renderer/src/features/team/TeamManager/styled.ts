import styled from 'styled-components'

export const TeamManagerStyled = styled.div`
  header {
    margin-bottom: 2rem;

    h2 {
      margin-bottom: 0;
    }

    p {
      color: ${props => props.theme.colors.textColor2};
    }
  }

  .teams {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;

    .team {
      width: 50%;

      .members {
        .member {
          height: 60px;
          padding: 0 1rem;
          display: flex;
          align-items: center;

          .DataDragonImage {
            margin-right: 0.5rem;
          }

          .emptyText {
            color: ${props => props.theme.colors.textColor2};
          }

          .rankProfile {
            margin-left: auto;

            .RankIcon {
              height: 40px;
              margin-left: 1rem;
            }

            .tier {
              display: inline-block;
              width: 1.5rem;
              text-align: right;
            }
          }
        }

        .ant-divider {
          margin: 0;
        }
      }
    }
  }

  .buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`
