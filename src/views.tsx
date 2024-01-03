import React, { StrictMode, useContext } from 'react'
import { Provider, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Root, createRoot } from 'react-dom/client'
import { ItemView, WorkspaceLeaf } from 'obsidian'
import TogglPlugin from './main'
import { createContext } from 'react'
import { currentEntryAtom, currentEntryProjectAtom, passedSecondsAtom, passedTimeAtom, savedTimersAtom, store } from './atoms'
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query'
import { TimeEntry } from './interfaces'
import { TimerDetailModal, TimerListModal } from './modal'
import { css } from '@emotion/css'
import { ClipLoader } from 'react-spinners'

export const VIEW_TYPE_TOGGL = 'toggl'

export class TogglView extends ItemView {
	private root: Root | null = null
	private plugin: TogglPlugin

	constructor(leaf: WorkspaceLeaf, plugin: TogglPlugin) {
		super(leaf)
		this.plugin = plugin
	}

	getIcon(): string {
		return 'clock'
	}

	getViewType(): string {
		return VIEW_TYPE_TOGGL
	}

	getDisplayText() {
		return 'Toggl'
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1])
		const queryClient = new QueryClient()
		this.root.render(
			<StrictMode>
				<Provider store={store}>
					<QueryClientProvider client={queryClient}>
						<PluginContext.Provider value={this.plugin}>
							<Main />
						</PluginContext.Provider>
					</QueryClientProvider>
				</Provider>
			</StrictMode>
		)
	}

	async onClose() {
		this.root?.unmount()
	}
}


// below is the code for React Components

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PluginContext = createContext<TogglPlugin>(null!)

export const usePlugin = () => {
	return useContext(PluginContext)
}

export const useStopTimerMutation = () => {
	const plugin = usePlugin()
	const mutationFn: (timer: TimeEntry) => Promise<void> = plugin.togglService.api.stopTimeEntry.bind(plugin.togglService.api)
	return useMutation({
		mutationFn: mutationFn
	})
}

const DEFAULT_TEXT = "No time entry running"


export const CurrentTimer = () => {
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
		>{DEFAULT_TEXT}</div>
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
			<button
				onClick={onStop}
				disabled={stopTimerMutation.isPending}
				className={css`
					flex: 1;
					cursor: ${stopTimerMutation.isPending ? "not-allowed" : "pointer"};
				`}
			>
				{stopTimerMutation.isPending ? (
					<ClipLoader size={24}
						cssOverride={{
							borderColor: "var(--accent-h)",
						}}
					/>
				) : "Stop"}
			</button>
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
				<div className={css`
					font-size: var(--font-ui-large);
					font-weight: var(--font-semibold);
					font-variant-numeric: tabular-nums;
				`}>
					{passed}
				</div>
			</ div >
		</div>
	)
}

export const Main = () => {
	const plugin = usePlugin()
	const app = plugin.app
	const onClick = () => {
		const modal = new TimerDetailModal(app)
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
			<CurrentTimer />
			<section className={css`
				display: flex;
				flex-direction: column;
				gap: var(--size-4-2);
			`}>
				<button onClick={onClick}
					className={css`
						display: block;
						margin-left: auto;
						cursor: pointer;
					`}
				>Add Timer</button>
				<TimerListModal.Content plugin={plugin} />
			</section>
		</div>
	)
}