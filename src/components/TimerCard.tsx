import React, { useMemo } from "react"
import { useMutation } from "@tanstack/react-query"
import { useAtom, useAtomValue } from "jotai"
import { currentEntryAtom, meAtom, passedSecondsAtom, todayTimeEntriesAtom } from "../atoms"
import { Project, Timer } from "../interfaces"
import TogglPlugin from "../main"
import { css } from "@emotion/css"
import { FiPause, FiPlay } from "react-icons/fi"
import { Button } from "./Button"
import { TimeDisplay } from "./TimeDisplay"
import { formatSeconds, isActiveEntry, isSameTimer } from "src/utils"
import { useStopTimerMutation } from "src/hooks"
import { produce } from "immer"

interface Props {
  timer: Timer
  project?: Project
  plugin: TogglPlugin
  onSuccess?: () => void
}

export const TimerCard = ({ timer, plugin, project, onSuccess }: Props) => {
  const [me, setMe] = useAtom(meAtom)
  const mutationFn = plugin.togglService.api.createTimeEntry.bind(
    plugin.togglService.api
  ) as typeof plugin.togglService.api.createTimeEntry
  const [currentEntry, setCurrentEntry] = useAtom(currentEntryAtom)
  const [passedSeconds, setPassedSeconds] = useAtom(passedSecondsAtom)
  const todayTimeEntries = useAtomValue(todayTimeEntriesAtom)
  const stopTimerMutation = useStopTimerMutation()

  const sameTimerEntries = useMemo(() => {
    return todayTimeEntries.filter(entry => isSameTimer({ timer, entry }))
  }, [timer, todayTimeEntries])

  const isCurrentEntry = currentEntry ? isSameTimer({ timer, entry: currentEntry }) : false

  const duration = useMemo(() => {
    return sameTimerEntries.reduce((acc, entry) => {
      const duration = entry.duration === -1 ? (passedSeconds ?? 0) : entry.duration
      return acc + duration
    }, 0)
  }, [sameTimerEntries, passedSeconds])

  const mutation = useMutation(
    {
      mutationFn,
      onSuccess: (entry) => {
        setCurrentEntry(entry.data)
        onSuccess?.()
        setMe(prev => produce(prev, draft => {
          if (draft) {
            const oldEntries = (draft?.time_entries ?? []).filter(entry => !isActiveEntry(entry))
            draft.time_entries = [...oldEntries, entry.data]
          }
          return draft
        }))
      }
    }
  )

  const onClick = (timer: Timer) => {
    if (isCurrentEntry) {
      stopTimerMutation.mutate(currentEntry!, {
        onSuccess: () => {
          setCurrentEntry(null)
          setPassedSeconds(null)
        }
      })
    } else {
      mutation.mutate({
        ...timer,
        workspaceId: me!.default_workspace_id,
        billable: false,
        start: new Date().toISOString(),
        createdWith: "obsidian-toggl-plugin"
      })
    }
  }
  return (
    <section className={css`
          background: var(--background-modifier-form-field);
          padding: var(--size-4-2);
          display: flex;
          flex-direction: column;
          gap: var(--size-4-2);
          border-radius: var(--radius-m);
          border: 1px solid var(--background-modifier-border);
        `}>
      <div className={css`
          display: flex;
          flex-direction: column;
          flex-grow: 1;
      `}>
        <div style={{ color: project?.color }}>{timer.projectName}</div>
        <div
          className={css`
            font-size: var(--font-smallest);
            color: var(--text-muted);
          `}
        >{timer.description}</div>
        <div className={css`
          font-size: var(--font-ui-smaller);
          color: var(--text-accent);
        `}>{timer.tags.join(",")}</div>
      </div>
      <div className={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
      `}>
        <TimeDisplay className={css`
          font-size: var(--font-smaller);
        `}>{duration === 0 ? null : formatSeconds(duration)}</TimeDisplay>
        <Button onClick={() => onClick(timer)}
          isLoading={mutation.isPending || stopTimerMutation.isPending}
        >
          {isCurrentEntry ? <FiPause /> : <FiPlay />}
        </Button>
      </div>
    </section>
  )
}