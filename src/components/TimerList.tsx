import React from 'react'
import { css } from "@emotion/css"
import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { projectsAtom, savedTimersAtom } from "../atoms"
import { Project } from "../interfaces"
import TogglPlugin from "../main"
import { TimerCard } from './TimerCard'

interface Props {
  onSave?: () => void
  plugin: TogglPlugin
}


export const TimerList = ({ onSave, plugin }: Props) => {
  const timers = useAtomValue(savedTimersAtom)
  const projects = useAtomValue(projectsAtom)
  const projectDict = useMemo(() => Object.fromEntries(
    projects.map(project => [project.id, project])
  ), [projects])
  const findProject = (projectId: number): Project | undefined => projectDict[projectId]

  return (
    <div className={css`
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--size-4-1);
    `}>
      {timers.map((timer, index) => {
        const project = findProject(timer.projectId)
        return <TimerCard onSuccess={onSave} key={index} timer={timer} project={project} plugin={plugin} />
      })}
    </div>
  )
}