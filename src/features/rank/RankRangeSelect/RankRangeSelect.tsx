import { forwardRef } from 'react';

import { RefSelectProps, Select, SelectProps } from 'antd';
import clsx from 'clsx';

import { RankRangeSelectStyled } from './styled';

export interface RankRangeSelectProps extends SelectProps {
  className?: string;
}

const RankRangeSelect = forwardRef<RefSelectProps, RankRangeSelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <RankRangeSelectStyled className={clsx('RankRangeSelect', className)}>
        <Select
          {...props}
          ref={ref}
          options={[
            { value: 2, label: '플레티넘+' },
            { value: 13, label: '다이아+' },
            { value: 3, label: '마스터+' },
            { value: 1, label: '브실골' },
          ]}
        />
      </RankRangeSelectStyled>
    );
  },
);

export default RankRangeSelect;
