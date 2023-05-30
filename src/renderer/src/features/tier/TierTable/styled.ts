import styled from 'styled-components'

export const TierTableStyled = styled.div`
  > header {
    display: flex;
    align-items: flex-end;
    margin-bottom: 0.8rem;
    line-height: 1;

    h2 {
      margin-bottom: 0;
      margin-right: 1rem;
      transform: translateY(2px);
    }

    .updatedAt {
      font-size: 0.85rem;
      margin-right: 1rem;
    }

    .info {
      font-size: 0.85rem;
      color: ${props => props.theme.colors.textColor2};
    }
  }

  .arguments {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ant-table {
    td {
      border-top: none !important;
      border-bottom: none !important;
    }

    .ant-table-tbody td {
      cursor: pointer;
    }

    .tier1 td {
      background-color: rgba(235, 87, 87, 0.2);

      &.ant-table-cell-row-hover {
        background-color: rgba(235, 87, 87, 0.3) !important;
      }
    }

    .tier2 td {
      background-color: rgba(249, 124, 73, 0.2);

      &.ant-table-cell-row-hover {
        background-color: rgba(249, 124, 73, 0.3) !important;
      }
    }

    .tier3 td {
      background-color: rgba(250, 181, 25, 0.2);

      &.ant-table-cell-row-hover {
        background-color: rgba(250, 181, 25, 0.3) !important;
      }
    }

    .tier4 td {
      background-color: rgba(0, 180, 128, 0.2);

      &.ant-table-cell-row-hover {
        background-color: rgba(0, 180, 128, 0.3) !important;
      }
    }

    .tier5 td {
      background-color: rgba(39, 147, 207, 0.2);

      &.ant-table-cell-row-hover {
        background-color: rgba(39, 147, 207, 0.3) !important;
      }
    }
  }
`
