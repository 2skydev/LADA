import clsx from 'clsx'

import * as Styled from './RankingVariation.styled'

export interface RankingVariationProps {
  className?: string
  value: number
  max?: number
}

const RankingVariation = ({ className, value, max }: RankingVariationProps) => {
  const isUp = value > 0
  const isDown = value < 0

  const upDownSvgProps = {
    strokeWidth: '2',
    stroke: 'currentColor',
    strokeMiterlimit: '10',
    strokeLinecap: 'round',
  } as const

  return (
    <Styled.Root className={clsx('RankingVariation', { isUp, isDown }, className)}>
      <svg
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        {...(value && upDownSvgProps)}
      >
        {!value && (
          <path
            fill="currentColor"
            d="M6.05039 13.3247C5.68319 13.3247 5.36239 13.1871 5.08799 12.9119C4.81279 12.6375 4.67519 12.3167 4.67519 11.9495C4.67519 11.5831 4.81279 11.2623 5.08799 10.9871C5.36239 10.7119 5.68319 10.5743 6.05039 10.5743H17.9496C18.3168 10.5743 18.6376 10.7119 18.912 10.9871C19.1872 11.2623 19.3248 11.5831 19.3248 11.9495C19.3248 12.3167 19.1872 12.6375 18.912 12.9119C18.6376 13.1871 18.3168 13.3247 17.9496 13.3247H6.05039Z"
          />
        )}

        {isUp && (
          <>
            <path d="M5.64014 12L12.0001 5.64L18.3601 12"></path>
            <path d="M12 5.63998V18.36"></path>
          </>
        )}

        {isDown && (
          <>
            <path d="M18.3599 12L11.9999 18.36L5.63986 12"></path>
            <path d="M12 18.36V5.64001"></path>
          </>
        )}
      </svg>

      {max ? (value > max ? 'NEW' : Math.abs(value)) : Math.abs(value)}
    </Styled.Root>
  )
}

export default RankingVariation
