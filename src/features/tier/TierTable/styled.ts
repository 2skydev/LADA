import styled from 'styled-components';

export const TierTableStyled = styled.div`
  .ant-table {
    .tier1 td {
      background-color: rgba(235, 87, 87, 0.1);

      &.ant-table-cell-row-hover {
        background-color: rgba(235, 87, 87, 0.2) !important;
      }
    }

    .tier2 td {
      background-color: rgba(249, 124, 73, 0.1);

      &.ant-table-cell-row-hover {
        background-color: rgba(249, 124, 73, 0.2) !important;
      }
    }

    .tier3 td {
      background-color: rgba(250, 181, 25, 0.1);

      &.ant-table-cell-row-hover {
        background-color: rgba(250, 181, 25, 0.2) !important;
      }
    }

    .tier4 td {
      background-color: rgba(0, 180, 128, 0.1);

      &.ant-table-cell-row-hover {
        background-color: rgba(0, 180, 128, 0.2) !important;
      }
    }

    .tier5 td {
      background-color: rgba(39, 147, 207, 0.1);

      &.ant-table-cell-row-hover {
        background-color: rgba(39, 147, 207, 0.2) !important;
      }
    }
  }
`;
