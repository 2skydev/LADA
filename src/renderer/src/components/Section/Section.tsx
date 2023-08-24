import { ReactNode } from 'react'

import 'antd'
import clsx from 'clsx'

import * as Styled from './Section.styled'

export interface SectionProps {
  className?: string
  children?: ReactNode
  title: string
  description?: ReactNode
}

const Section = ({ className, children, title, description }: SectionProps) => {
  return (
    <Styled.Root className={clsx('Section', className)}>
      <div className="left">
        <h3 className="title">{title}</h3>

        {description && <div className="description">{description}</div>}
      </div>

      <div className="content">{children}</div>
    </Styled.Root>
  )
}

export default Section
