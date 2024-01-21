import { App, Modal } from "obsidian";
import React from 'react'
import { Root, createRoot } from "react-dom/client";
import type TogglPlugin from "../main";
import { TimerList } from "../components/TimerList";
import { Provider, TimerForm } from "../components";
import { css } from "@emotion/css";
import { ProjectForm } from "src/components/ProjectForm";

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
				<div className={css`
					margin-top: var(--size-4-4);
				`}>
				<TimerList plugin={this.plugin} onSave={onSave} />
				</div>
			</Provider>
		)
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}



export class ProjectModal extends Modal {
	private root: Root | null = null
	private plugin: TogglPlugin
	private projectId?: number

	constructor(plugin: TogglPlugin, projectId?: number) {
		super(plugin.app)
		this.plugin = plugin
		this.projectId = projectId
	}

	onOpen() {
		const { contentEl } = this;
		this.root = createRoot(contentEl)
		const onSuccess = this.close.bind(this)
		this.root.render(
			<Provider plugin={this.plugin}>
				<ProjectForm onSucecss={onSuccess} projectId={this.projectId} />
			</Provider>
		)
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}