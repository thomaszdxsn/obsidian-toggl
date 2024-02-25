import React, { useMemo } from "react";
import { Project, TimeEntry } from "../interfaces";
import { Timeline } from "./Timeline";
import { calcPercentage, formatSeconds, formatTime } from "../utils";
import { css } from "@emotion/css";
import clsx from "clsx";
import { TimeDisplay } from "./TimeDisplay";

interface Props {
  className?: string;
  entries: TimeEntry[];
  projectDict: Record<string, Project>;
  entryMinHeight?: number;
  equalEntryHeight?: boolean;
}

export const EntriesTimeline = ({
  className,
  entries,
  projectDict,
  entryMinHeight = 100,
  equalEntryHeight = true,
}: Props) => {
  const items = useMemo(() => {
    const totalDuration = entries.reduce((acc, entry) => {
      return acc + entry.duration;
    }, 0);
    return entries
      .slice()
      .sort((a, b) => (a.start < b.start ? 1 : -1))
      .map((entry) => {
        const project = entry.project_id
          ? projectDict[entry.project_id]
          : undefined;
        const percentage = equalEntryHeight
          ? calcPercentage(1, entries.length)
          : calcPercentage(entry.duration, totalDuration);
        const label = (
          <div
            className={css`
              display: flex;
              justify-content: space-between;
              height: 100%;
              gap: 8px;
              padding-right: 16px;
            `}
          >
            <div
              className={css`
                flex-shrink: 0;
                display: flex;
                height: 100%;
                flex-direction: column;
                justify-content: space-between;
                min-width: 0;
                padding: 16px 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              `}
            >
              <div style={{ color: project?.color }}>{project?.name}</div>
              <div
                className={css`
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                `}
              >
                {entry.description}
              </div>
              <div
                className={css`
                  color: var(--text-accent);
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                `}
              >
                🏷️ {entry.tags.join(",")}
              </div>
            </div>
            <div
              className={css`
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: end;
                gap: 8px;
                flex-shrink: 0;
              `}
            >
              <TimeDisplay
                className={css`
                  font-size: 1rem;
                  font-weight: var(--font-semibold);
                `}
              >
                {formatSeconds(entry.duration)}
              </TimeDisplay>
              <TimeDisplay
                className={css`
                  font-size: 0.75rem;
                `}
              >
                {formatTime(entry.start)} - {formatTime(entry.stop)}
              </TimeDisplay>
            </div>
          </div>
        );
        return {
          color: project?.color || "var(--background-primary)",
          label: label,
          percentage: percentage,
        };
      });
  }, [entries, projectDict]);
  const totalHeight = useMemo(() => {
    const smallestPercentage = Math.min(
      ...items.map((item) => item.percentage),
    );
    return items.reduce((acc, item) => {
      return acc + (item.percentage / smallestPercentage) * entryMinHeight;
    }, 0);
  }, [items, entryMinHeight]);
  return (
    <Timeline
      direction="vertical"
      className={clsx(
        className,
        css`
          height: ${totalHeight}px;
        `,
      )}
      items={items}
      size="medium"
      gap={1}
      finished
    />
  );
};
