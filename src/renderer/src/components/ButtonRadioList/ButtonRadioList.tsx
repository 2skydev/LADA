import { ReactNode } from 'react'

import clsx from 'clsx'

import * as Styled from './ButtonRadioList.styled'

export interface ButtonRadioListOptions {
  label: ReactNode
  value: any
}

export interface ButtonRadioListProps {
  className?: string
  options: ButtonRadioListOptions[]
  value?: any
  onChange?: (value: any) => void
}

const ButtonRadioList = ({ className, options, value, onChange }: ButtonRadioListProps) => {
  const handleChange = (option: ButtonRadioListOptions) => {
    onChange?.(option.value)
  }

  return (
    <Styled.Root className={clsx('ButtonRadioList', className)}>
      {options.map(option => (
        <div
          className={clsx('item', value === option.value && 'checked')}
          key={option.value}
          onClick={() => handleChange(option)}
        >
          <div className="label">{option.label}</div>
          <div className="radioIcon" />
        </div>
      ))}
    </Styled.Root>
  )
}

export default ButtonRadioList
