import React, { StrictMode, useContext, useEffect, useMemo, useState } from 'react'
import { Root, createRoot } from 'react-dom/client'
import { ItemView, WorkspaceLeaf } from 'obsidian'
import TogglPlugin from './main'
import { createContext } from 'react'
import dayjs from 'dayjs'
import { formatSeconds } from './utils'

export const VIEW_TYPE_TOGGL = 'toggl'

export class TogglView extends ItemView {
	private root: Root | null = null
	private plugin: TogglPlugin

	constructor(leaf: WorkspaceLeaf, plugin: TogglPlugin) {
		super(leaf)
		this.plugin = plugin
	}

	getViewType(): string {
		return VIEW_TYPE_TOGGL
	}

	getDisplayText() {
		return 'Toggl'
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1])
		this.root.render(
			<StrictMode>
				<PluginContext.Provider value={this.plugin}>
					<CurrentTimer />
				</PluginContext.Provider>
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

const usePlugin = () => {
	return useContext(PluginContext)
}

const DEFAULT_TEXT = "No time entry running"

export const CurrentTimer = () => {
	const plugin = usePlugin()
	const [currentTimer, setCurrentTimer] = useState<{ passed: string | null, projectId: number | null, description: string | null }>({ passed: null, projectId: null, description: null })
	useEffect(() => {
		const interval = setInterval(async () => {
			const currentEntry = plugin.togglService.currentEntry
			if (!currentEntry) {
				setCurrentTimer({ passed: DEFAULT_TEXT, projectId: null, description: null })
				return
			} else {
				const passedSeconds = dayjs().diff(dayjs(currentEntry.start), 'second')
				const passed = formatSeconds(passedSeconds)
				setCurrentTimer({ passed, projectId: currentEntry.project_id, description: currentEntry.description })
			}
		}, 1000)
		return () => clearInterval(interval)
	}, [plugin])
	const project = useMemo(() => {
		if (!currentTimer.projectId) {
			return
		}
		return plugin.togglService.projects.find(p => p.id === currentTimer.projectId)
	}, [plugin, currentTimer])

	if (!currentTimer.passed) {
		return <div>{DEFAULT_TEXT}</div>
	}
	return (
		<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
			<div style={{ display: "flex", flexDirection: "column" }}>
				{project && <div style={{color: project.color}}>{project?.name}</div>}
				<div>{currentTimer.description}</div>
			</div>
			<div>
				<div>{currentTimer.passed}</div>
			</div>
		</ div >
	)
}


