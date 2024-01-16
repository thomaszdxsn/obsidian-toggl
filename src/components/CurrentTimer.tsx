import React from 'react'
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useStopTimerMutation } from "../hooks"
import { currentEntryAtom, currentEntryProjectAtom, passedSecondsAtom, passedTimeAtom } from "../atoms"
import { css } from '@emotion/css'
import ClipLoader from 'react-spinners/ClipLoader'
import { FiPause } from 'react-icons/fi'
import { TimeDisplay } from './TimeDisplay'
import { Button } from './Button'

export const CurrentTimer = ({ placeholder = "No time entry running" }: { placeholder?: string }) => {
  const stopTimerMutation = useStopTimerMutation()
  const passed = useAtomValue(passedTimeAtom)
  const setPassedNumbers = useSetAtom(passedSecondsAtom)
  const [currentEntry, setCurrentEntry] = useAtom(currentEntryAtom)
  const currentProject = useAtomValue(currentEntryProjectAtom)
  const onStop = () => {
    if (!currentEntry) {
      return
    }
    stopTimerMutation.mutate(currentEntry, {
      onSuccess: () => {
        setCurrentEntry(null)
        setPassedNumbers(null)
      }
    })
  }
  if (!passed) {
    return <div
      className={css`
				height: 100px;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: var(--radius-m);
				background-color: var(--background-primary);
			`}
    >{placeholder}</div>
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
      <div className={css`
			display: flex;
			justify-content: space-between;
			align-items: center;
		`}>
        <div className={`
					display: flex;
					flex-direction: column;
					gap: 1rem;
					align-items: center;
				`}>
          {currentProject && <div style={{ color: currentProject.color }}>{currentProject.name}</div>}
          {currentEntry && <div
            className={css`
							font-size: var(--font-smallest);
							color: var(--text-muted);
						`}
          >{currentEntry.description}</div>}
        </div>
        <TimeDisplay
          className={css`
          font-size: var(--font-ui-large);
          font-weight: var(--font-semibold);
          `}
        >
          {passed}
        </TimeDisplay>
      </ div >
    </div>
  )
}
