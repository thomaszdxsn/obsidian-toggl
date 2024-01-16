import React from 'react'
import clsx from 'clsx'
import { css } from '@emotion/css'

interface Props {
  className?: string
  children: React.ReactNode
}

export const TimeDisplay = ({ children, className }: Props) => {
  return (
    <div className={
      clsx(css`
        font-variant-numeric: tabular-nums;
        `, className)
    }>
      {children}
    </div>
  )
}