import { forwardRef } from 'react';

import { Radio, RadioGroupProps } from 'antd';
import clsx from 'clsx';

import LaneIcon from '../LaneIcon';
import { LaneSelectStyled } from './styled';

export interface LaneSelectProps extends RadioGroupProps {
  className?: string;
}

const lanes = ['탑', '정글', '미드', '원딜', '서폿'];

const LaneSelect = forwardRef<HTMLDivElement>(({ className, ...props }: LaneSelectProps, ref) => {
  return (
    <LaneSelectStyled className={clsx('LaneSelect', className)}>
      <Radio.Group ref={ref} {...props}>
        {lanes.map((lane, index) => (
          <Radio.Button key={index} value={index}>
            <LaneIcon laneId={index} /> <small>{lane}</small>
          </Radio.Button>
        ))}
      </Radio.Group>
    </LaneSelectStyled>
  );
});

export default LaneSelect;
