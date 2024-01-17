import React from 'react'
import { FiRefreshCw } from "react-icons/fi"
import { Button } from "./Button"
import { usePlugin } from '../hooks'
import { useMutation } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { currentEntryAtom, meAtom } from 'src/atoms'
import { css } from '@emotion/css'

export const RefreshButton = () => {
  const plugin = usePlugin()
  const setMe = useSetAtom(meAtom)
  const setCurrentEntry = useSetAtom(currentEntryAtom)
  const fetchMutation = useMutation({
    mutationFn: () => plugin.togglService.api.getMe(),
    onSuccess: ({ data }) => {
      setMe(data)
      const currentEntry = data.time_entries.find(e => e.duration === -1) ?? null
      setCurrentEntry(currentEntry)
    }
  })
  return (
    <Button onClick={() => fetchMutation.mutate()}
      disabled={fetchMutation.isPending}
    >
      <FiRefreshCw className={
        css`
          animation: ${fetchMutation.isPending ? "spin 1s linear infinite" : "unset"};
        `
      } />
    </Button>
  )
}