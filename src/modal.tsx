import { App, Modal } from "obsidian";
import React from 'react'
import { Root, createRoot } from "react-dom/client";
import type TogglPlugin from "./main";
import { TimerList } from "./components/TimerList";
import { Provider, TimerForm } from "./components";

export class TimerDetailModal extends Modal {
	private root: Root | null = null
	private plugin: TogglPlugin

	constructor(app: App, plugin: TogglPlugin) {
		super(app);
		this.plugin = plugin
	}


	onOpen() {
		const { contentEl } = this;
		this.root = createRoot(contentEl)
		const onSuccess = this.close.bind(this)
		this.root.render(
			<Provider plugin={this.plugin}>
				<TimerForm onSuccess={onSuccess} />
			</Provider>
		)
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	
}


export class TimerListModal extends Modal {
	private root: Root | null = null
	private plugin: TogglPlugin

	constructor(app: App, plugin: TogglPlugin) {
		super(app);
		this.plugin = plugin
	}

	onOpen() {
		const { contentEl } = this;
		this.root = createRoot(contentEl)
		const onSave = this.close.bind(this)
		this.root.render(
			<Provider plugin={this.plugin}>
				<TimerList plugin={this.plugin} onSave={onSave} />
			</Provider>
		)
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

