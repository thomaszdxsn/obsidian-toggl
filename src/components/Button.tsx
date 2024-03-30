import { css } from '@emotion/css'
import clsx from 'clsx'
import React from 'react'
import { ClipLoader } from 'react-spinners'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  isLoading?: boolean
  loadingIconSize?: number
}


export const Button = ({ children, isLoading, loadingIconSize = 13, className, ...props }: Props) => {
  return <button
    {...props}
    disabled={isLoading || props.disabled}
    className={
      clsx(css`
        cursor: ${isLoading ? "wait" : "pointer"};
      `, className)
    }
  >{isLoading ?
    <ClipLoader size={loadingIconSize}
      data-testid="loading-icon"
      cssOverride={{
        borderColor: "var(--accent-h)",
      }}
    />
    : children}</button>
}