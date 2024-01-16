import React from 'react'
import { ClipLoader } from 'react-spinners'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  isLoading?: boolean
  loadingIconSize?: number
}


export const Button = ({ children, isLoading, loadingIconSize=13, ...props }: Props) => {
  return <button
    {...props}
    disabled={isLoading || props.disabled}
  >{isLoading ?
    <ClipLoader size={loadingIconSize}
      cssOverride={{
        borderColor: "var(--accent-h)",
      }}
    />
    : children}</button>
}