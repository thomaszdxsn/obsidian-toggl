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
				gap: var(--size-4-4);
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
    const dayMilliSeconds = 24 * 60 * 60 * 1000
    return entries.filter((entry): entry is (typeof entry & { project_id: string }) => !!entry.project_id).map(entry => {
      const project = projectDict[entry.project_id]
      const duration = entry.duration !== -1 ? entry.duration : dayjs().diff(entry.start, "millisecond")
      const percentage = duration / dayMilliSeconds
      return {
        color: project.color,
        label: project.name,
        percentage: percentage
      }
    })

  }, [entries, projectDict])
  return (
    <div>
      <div className={css`
        background: var(--background-primary);
        border-start-end-radius: 1rem;
        border-end-end-radius: 1rem;
      `}>
        <Timeline items={timelineItems} direction="horizontal" showLabel={false} size="medium" />
      </div>
    </div>
  )
}