import { css } from "@emotion/css"
import React, { useMemo } from "react"
import { usePlugin } from "../hooks"
import { ProjectModal, TimerDetailModal } from "../plugin/modal"
import { CurrentTimer } from "./CurrentTimer"
import { TimerList } from "./TimerList"
import { FiCornerUpLeft, FiFolder, FiPlus } from 'react-icons/fi'
import { Button } from "./Button"
import { useAtomValue, useSetAtom } from "jotai"
import { activeProjectsAtom, projectDictAtom, todayTimeEntriesAtom, viewAtom } from "src/atoms"
import dayjs from "dayjs"
import { Timeline } from "./Timeline"
import { RefreshButton } from "./RefreshButton"
import { EntryList } from "./EntryList"
import { ProjectList } from "./ProjectList"

export const MainView = () => {
  const currentView = useAtomValue(viewAtom)
  const viewContent = useMemo(() => {
    switch (currentView) {
      case "homepage":
        return <HomePageView />
      case "projects":
        return <ProjectsView />
      case "tags":
        return <TagsView />
      default:
        return null
    }
  }, [currentView])
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
        {viewContent}
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


export const HomePageView = () => {
  const plugin = usePlugin()
  const app = plugin.app
  const switchView = useSetAtom(viewAtom)
  const onAddTimer = () => {
    const modal = new TimerDetailModal(app, plugin)
    modal.open()
  }
  const onSwitchToProjectsView = () => {
    switchView("projects")
  }
  return (
    <>
      <div className={css`
          display: flex;
          gap: var(--size-4-2);
          justify-content: flex-end;
        `}>
        <Button onClick={onSwitchToProjectsView} title="projects">
          <FiFolder />
        </Button>
        <RefreshButton />
        <Button onClick={onAddTimer} title="add new timer">
          <FiPlus />
        </Button>
      </div>
      <TimerList plugin={plugin} />
      <EntryList />
    </>
  )
}


export const ProjectsView = () => {
  const plugin = usePlugin()
  const switchView = useSetAtom(viewAtom)
  const backToHomePage = () => switchView("homepage")
  const onAddProject = () => {
    const modal = new ProjectModal(plugin)
    modal.open()
  }
  const projects = useAtomValue(activeProjectsAtom)
  return (
    <>
      <div className={css`
      display: flex;
      justify-content: space-between;
    `}>
        <Button onClick={backToHomePage} title="projects">
          <FiCornerUpLeft />
        </Button>
        <div className={css`
          display: flex;
          gap: var(--size-4-2);
        `}>
          <Button onClick={onAddProject} title="add new projeect">
            <FiPlus />
          </Button>
        </div>
      </div>
      <ProjectList data={projects} />
    </>
  )
}


export const TagsView = () => {
  return null
}