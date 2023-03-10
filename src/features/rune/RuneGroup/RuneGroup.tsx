import { ReactNode } from 'react';

import clsx from 'clsx';

import DataDragonImage from '~/features/asset/DataDragonImage';
import useRuneData from '~/hooks/useRuneData';

import { RuneGroupStyled } from './styled';

export interface RuneGroupProps {
  className?: string;
  children?: ReactNode;
  type: 'main' | 'sub' | 'shard';
  activeRuneIds: number[];
}

const RuneGroup = ({ className, type, activeRuneIds }: RuneGroupProps) => {
  const data = useRuneData();
  if (!data) return null;

  const categoryData = data[Math.floor(activeRuneIds[0] / 100) * 100];

  return (
    <RuneGroupStyled
      className={clsx('RuneGroup', type, className)}
      data-category={categoryData.key}
    >
      {categoryData.slots.slice(type === 'sub' ? 1 : 0).map((rules, i) => (
        <div className="slot" key={i}>
          {rules.map(rune => (
            <div
              className={clsx('rune', activeRuneIds[i] === rune.id && 'active')}
              key={`${i}.${rune.id}`}
            >
              <DataDragonImage type="perk-images" filename={rune.icon} circle />
              <div className="ring" />
              <div className="ring hover" />
            </div>
          ))}
        </div>
      ))}
    </RuneGroupStyled>
  );
};

export default RuneGroup;
