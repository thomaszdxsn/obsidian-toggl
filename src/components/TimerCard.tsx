import React from "react"
import { useMutation } from "@tanstack/react-query"
import { useAtomValue, useSetAtom } from "jotai"
import { currentEntryAtom, meAtom } from "../atoms"
import { Project, Timer } from "../interfaces"
import TogglPlugin from "../main"
import { css } from "@emotion/css"
import ClipLoader from "react-spinners/ClipLoader"
import { FiPlay } from "react-icons/fi"

interface Props {
  timer: Timer
  project?: Project
  plugin: TogglPlugin
  onSuccess?: () => void
}

export const TimerCard = ({ timer, plugin, project, onSuccess }: Props) => {
  const me = useAtomValue(meAtom)
  const mutationFn = plugin.togglService.api.createTimeEntry.bind(
    plugin.togglService.api
  ) as typeof plugin.togglService.api.createTimeEntry
  const setCurrentEntry = useSetAtom(currentEntryAtom)
  const mutation = useMutation(
    {
      mutationFn,
      onSuccess: (entry) => {
        setCurrentEntry(entry.data)
        onSuccess?.()
      }
    }
  )

  const onStart = (timer: Timer) => {
    mutation.mutate({
      ...timer,
      workspaceId: me!.default_workspace_id,
      billable: false,
      start: new Date().toISOString(),
      createdWith: "obsidian-toggl-plugin"
    })
  }
  return (
    <section className={css`
          background: var(--background-modifier-form-field);
          padding: var(--size-4-2);
          display: flex;
          flex-direction: column;
          gap: var(--size-4-2);
          border-radius: var(--radius-m);
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
      <button onClick={() => onStart(timer)}
        disabled={mutation.isPending}
        className={css`
          cursor: ${mutation.isPending ? "wait" : "pointer"}
        `}
      >
        {mutation.isPending ? (
          <ClipLoader size={24}
            cssOverride={{
              borderColor: "var(--accent-h)",
            }}
          />
        ) : <FiPlay />}
      </button>
    </section>
  )
}