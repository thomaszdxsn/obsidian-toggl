import React, { StrictMode, useContext } from 'react'
import { Provider, useAtom, useAtomValue } from 'jotai'
import { Root, createRoot } from 'react-dom/client'
import { ItemView, WorkspaceLeaf } from 'obsidian'
import TogglPlugin from './main'
import { createContext } from 'react'
import { currentEntryAtom, currentEntryProjectAtom, passedTimeAtom, savedTimersAtom, store } from './atoms'
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query'
import { TimeEntry } from './interfaces'
import { TimerDetailModal, TimerListModal } from './modal'

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
							<main>
								<CurrentTimer />
								<Content />
							</main>
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
	const [currentEntry, setCurrentEntry] = useAtom(currentEntryAtom)
	const currentProject = useAtomValue(currentEntryProjectAtom)
	const onStop = () => {
		if (!currentEntry) {
			return
		}
		stopTimerMutation.mutate(currentEntry, {
			onSuccess: () => {
				setCurrentEntry(null)
			}
		})
	}
	if (!passed) {
		return <div>{DEFAULT_TEXT}</div>
	}
	return (
		<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
			<div style={{ display: "flex", flexDirection: "column" }}>
				{currentProject && <div style={{ color: currentProject.color }}>{currentProject.name}</div>}
				{currentEntry && <div>{currentEntry.description}</div>}
			</div>
			<div>
				<button onClick={onStop}>Stop</button>
				<div>{passed}</div>
			</div>
		</ div >
	)
}

export const Content = () => {
	const plugin = usePlugin()
	const app = plugin.app
	const onClick = () => {
		const modal = new TimerDetailModal(app)
		modal.open()
	}
	return (
		<section>
			<button onClick={onClick}>Add Timer</button>
			<TimerListModal.Content plugin={plugin} />
		</section>
	)
}