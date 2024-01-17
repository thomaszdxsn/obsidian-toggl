import React, { useMemo } from 'react'
import { Project, TimeEntry } from "../interfaces"
import { Timeline } from "./Timeline"
import { calcPercentage, formatSeconds } from '../utils'
import { css } from '@emotion/css'
import clsx from 'clsx'
import { TimeDisplay } from './TimeDisplay'
import dayjs from 'dayjs'

interface Props {
  className?: string
  entries: TimeEntry[]
  projectDict: Record<string, Project>
  entryMinHeight?: number;
  equalEntryHeight?: boolean;
}

export const EntriesTimeline = ({ className, entries, projectDict, entryMinHeight = 100, equalEntryHeight = true }: Props) => {
  const items = useMemo(() => {
    const totalDuration = entries.reduce((acc, entry) => {
      return acc + entry.duration
    }, 0)
    return entries.slice().sort((a, b) => a.start < b.start ? 1 : -1).map(entry => {
      const project = entry.project_id ? projectDict[entry.project_id] : undefined
      const percentage = equalEntryHeight ? calcPercentage(1, entries.length) : calcPercentage(entry.duration, totalDuration)
      const formatTime = (datetime: string) => dayjs(datetime).format("HH:MM")
      const label = (
        <div className={css`
          display: flex;
          justify-content: space-between;
          height: 100%;
          gap: 8px;
          padding-right: 16px;
        `}>
          <div className={css`
            display: flex;
            height: 100%;
            flex-direction: column;
            justify-content: space-between;
            min-width: 0;
            flex: 1;
            padding: 16px 0;
          `}>
            <div style={{ color: project?.color }}>{project?.name}</div>
            <div className={css`
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            `}>{entry.description}</div>
            <div>🏷️ {entry.tags.join(",")}</div>
          </div>
          <div className={css`
          height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 8px;
          `}>
            <TimeDisplay className={css`text-align: center; font-size: 1.25rem;`}>{formatSeconds(entry.duration)}</TimeDisplay>
            <TimeDisplay className={css`font-size: 0.75rem;`}>
              {formatTime(entry.start)} - {formatTime(entry.stop)}
            </TimeDisplay>
          </div>
        </div>
      )
      return {
        color: project?.color || "var(--background-primary)",
        label: label,
        percentage: percentage
      }
    })
  }, [entries, projectDict])
  const totalHeight = useMemo(() => {
    const smallestPercentage = Math.min(...items.map(item => item.percentage))
    return items.reduce((acc, item) => {
      return acc + (item.percentage / smallestPercentage * entryMinHeight)
    }, 0)
  }, [items, entryMinHeight])
  return <Timeline
    direction="vertical"
    className={clsx(className, css`
      height: ${totalHeight}px;
    `)}
    items={items}
    size="medium"
    gap={1}
  />
}