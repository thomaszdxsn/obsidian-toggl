import { css } from "@emotion/css"
import React, { useMemo } from "react"
import { usePlugin } from "../hooks"
import { TimerDetailModal } from "../plugin/modal"
import { CurrentTimer } from "./CurrentTimer"
import { TimerList } from "./TimerList"
import { FiPlus } from 'react-icons/fi'
import { Button } from "./Button"
import { useAtomValue } from "jotai"
import { projectDictAtom, todayTimeEntriesAtom } from "src/atoms"
import dayjs from "dayjs"
import { Timeline } from "./Timeline"

export const MainView = () => {
  const plugin = usePlugin()
  const app = plugin.app
  const onClick = () => {
    const modal = new TimerDetailModal(app, plugin)
    modal.open()
  }
  return (
    <div
      className={css`
				display: flex;
				flex-direction: column;
				gap: var(--size-4-2);
			`}
    >
      <TodayTimeline />
      <CurrentTimer />
      <section className={css`
				display: flex;
				flex-direction: column;
				gap: var(--size-4-2);
			`}>
        <Button onClick={onClick}
          className={css`
						display: block;
						margin-left: auto;
						cursor: pointer;
					`}
        >
          <FiPlus />
        </Button>
        <TimerList plugin={plugin} />
      </section>
    </div>
  )
}



export const TodayTimeline = () => {
  const entries = useAtomValue(todayTimeEntriesAtom)
  const projectDict = useAtomValue(projectDictAtom)
  const timelineItems = useMemo(() => {
    const total = entries.reduce((acc, entry) => {
      const duration = entry.duration !== -1 ? entry.duration : dayjs().diff(entry.start, "second")
      return acc + duration
    }, 0)
    return entries.sort((a, b) => a.start < b.start ? - 1 : 1).map(entry => {
      const project = entry.project_id ? projectDict[entry.project_id] : null
      const duration = entry.duration !== -1 ? entry.duration : dayjs().diff(entry.start, "second")
      const percentage = duration / total
      return {
        color: project?.color || "var(--background-primary)",
        label: project?.name,
        percentage: percentage
      }
    })

  }, [entries, projectDict])
  return (
    <div className={css`
        background: var(--background-primary);
        border-start-end-radius: 1rem;
        border-end-end-radius: 1rem;
        flex: 1;
      `}>
      <Timeline items={timelineItems} direction="horizontal" showLabel={false} />
    </div>
  )
}