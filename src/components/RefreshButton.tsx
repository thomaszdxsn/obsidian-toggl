import React from 'react'
import { FiRefreshCw } from "react-icons/fi"
import { Button } from "./Button"
import { useRefreshMutation } from '../hooks'
import { css } from '@emotion/css'

export const RefreshButton = () => {
  const refreshMutation = useRefreshMutation()
  return (
    <Button onClick={() => refreshMutation.mutate()}
      disabled={refreshMutation.isPending}
    >
      <FiRefreshCw className={
        css`
          animation: ${refreshMutation.isPending ? "spin 1s linear infinite" : "unset"};
        `
      } />
    </Button>
  )
}