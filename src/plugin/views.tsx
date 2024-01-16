import React from 'react'
import { Root, createRoot } from 'react-dom/client'
import { ItemView, WorkspaceLeaf } from 'obsidian'
import {MainView, Provider} from '../components'
import type TogglPlugin from '../main'

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
		this.root.render(
			<Provider plugin={this.plugin}>
				<MainView />
			</Provider>
		)
	}

	async onClose() {
		this.root?.unmount()
	}
}


