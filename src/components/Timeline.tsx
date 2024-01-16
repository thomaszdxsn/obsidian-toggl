import { css } from '@emotion/css'
import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  direction: "horizontal" | "vertical"
  gap?: number
  showLabel?: boolean
  rounded?: boolean
  finished?: boolean
  size?: "small" | "medium" | "large"
  items: {
    color: string
    label: React.ReactNode
    percentage: number
  }[]
}

const SIZE_MAP = {
  small: 4,
  medium: 8,
  large: 12,
} as const

export const Timeline = ({ className, direction, gap = 0, showLabel = true, rounded = true, finished = false, items, size = "small" }: Props) => {
  return (
    <div className={clsx(css`
      display: flex;
      flex-direction: ${direction === "horizontal" ? "row" : "column"};
      gap: ${gap}px;
    `, className)}>
      {items.map((item, index) => {
        const radiusValue = rounded ? "1rem" : "0"
        const horizontalStyle = {
          height: SIZE_MAP[size],
          ...(index === 0 ? { "border-start-start-radius": radiusValue, "border-end-start-radius": radiusValue } : {}),
          ...(index === items.length - 1 && finished ? { "border-start-end-radius": radiusValue, "border-end-end-radius": radiusValue } : {}),
        }
        const verticalStyle = {
          width: SIZE_MAP[size],
          ...(index === 0 ? { "border-start-start-radius": radiusValue, "border-start-end-radius": radiusValue } : {}),
          ...(index === items.length - 1 && finished ? { "border-end-start-radius": radiusValue, "border-end-end-radius": radiusValue } : {}),
        }
        const style = {
          backgroundColor: item.color,
          ...(direction === "horizontal" ? horizontalStyle : verticalStyle),
        }
        const containerStyle = {
          height: direction === "horizontal" ? "100%" : `${item.percentage * 100}%`,
          width: direction === "horizontal" ? `${item.percentage * 100}%` : "100%",
        }
        return <div key={index}
          style={containerStyle}
          className={css`
          display: flex;
          flex-direction: ${direction === "horizontal" ? "column" : "row"};
        `}>
          <div key={index} style={style} />
          <div>
            {item.label}
          </div>
        </div>
      })}
    </div>
  )
}