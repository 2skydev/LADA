import styled from 'styled-components'

export const DuoSynergyTableLaneTitleStyled = styled.div`
  display: flex;
  align-items: center;

  .LaneIcon {
    height: 20px;
  }
`

export const DuoSynergyTableChampProfileStyled = styled.div`
  display: inline-flex;
  min-width: 15rem;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  padding: 0.4rem;
  transition: 250ms background-color;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .texts {
    margin-left: 0.8rem;
    line-height: 1.3;

    .name {
      font-size: 0.75rem;
      color: ${props => props.theme.colors.textColor2};
    }
  }
`

export const DuoSynergyTableStyled = styled.div`
  > header {
    display: flex;
    align-items: flex-end;
    margin-bottom: 0.8rem;
    line-height: 1;

    h2 {
      margin-bottom: 0;
      transform: translateY(2px);
    }
  }

  .abc {
    display: flex;
  }

  .arguments {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .ant-select-selector {
      border-color: transparent;
    }

    .search {
      width: 12rem;
      height: 2.5rem;
      background-color: ${props => props.theme.colors.formFieldBG};
      border-color: transparent;
      border-radius: 6px;

      .ant-select-selector,
      .ant-select-selection-search-input {
        height: 100%;
      }

      .ant-select-selection-placeholder {
        line-height: 2.5rem;
      }
    }
  }
`
