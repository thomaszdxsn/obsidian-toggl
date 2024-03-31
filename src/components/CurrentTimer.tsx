import React from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useStopTimerMutation } from "../hooks";
import {
  currentEntryAtom,
  currentEntryProjectAtom,
  currentTimerAtom,
  passedSecondsAtom,
  passedTimeAtom,
} from "../atoms";
import { css } from "@emotion/css";
import { FiPause } from "react-icons/fi";
import { TimeDisplay } from "./TimeDisplay";
import { Button } from "./Button";
import { generateTimerId } from "../utils";

export const CurrentTimer = ({
  placeholder = "No time entry running",
}: {
  placeholder?: string;
}) => {
  const passed = useAtomValue(passedTimeAtom);
  const setPassedNumbers = useSetAtom(passedSecondsAtom);
  const [currentEntry, setCurrentEntry] = useAtom(currentEntryAtom);
  const currentTimer = useAtomValue(currentTimerAtom);
  const stopTimerMutation = useStopTimerMutation(
    currentTimer ? generateTimerId(currentTimer) : undefined,
  );
  const currentProject = useAtomValue(currentEntryProjectAtom);
  const onStop = () => {
    if (!currentEntry) {
      return;
    }
    stopTimerMutation.mutate(
      { timeEntryId: currentEntry.id, workspaceId: currentEntry.workspace_id },
      {
        onSuccess: () => {
          setCurrentEntry(null);
          setPassedNumbers(null);
        },
      },
    );
  };
  if (!passed) {
    return (
      <div
        className={css`
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: var(--radius-m);
          background-color: var(--background-primary);
        `}
      >
        {placeholder}
      </div>
    );
  }
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        background-color: var(--background-primary);
        padding: var(--size-4-4);
        border-radius: var(--radius-m);
        height: 100px;
        container-type: inline-size;
      `}
    >
      <Button
        onClick={onStop}
        isLoading={stopTimerMutation.isPending}
        className={css`
          flex: 1;
          cursor: ${stopTimerMutation.isPending ? "wait" : "pointer"};
          margin-bottom: var(--size-4-2);
        `}
      >
        <FiPause />
      </Button>
      <div
        className={css`
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          @container (min-width: 200px) {
            justify-content: space-between;
          }
        `}
      >
        <div>
          {currentProject && (
            <div style={{ color: currentProject.color }}>
              {currentProject.name}
            </div>
          )}
          {currentEntry && (
            <div
              className={css`
                font-size: var(--font-smallest);
                color: var(--text-muted);
              `}
            >
              {currentEntry.description}
            </div>
          )}
        </div>
        <TimeDisplay
          className={css`
            font-size: var(--font-ui-large);
            font-weight: var(--font-semibold);
          `}
        >
          {passed}
        </TimeDisplay>
      </div>
    </div>
  );
};
