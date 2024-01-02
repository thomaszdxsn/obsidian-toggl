import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { Provider, useAtomValue, useSetAtom } from "jotai";
import { App, Modal } from "obsidian";
import React, { StrictMode, useMemo } from 'react'
import { Root, createRoot } from "react-dom/client";
import { activeProjectsAtom, currentEntryAtom, meAtom, projectsAtom, savedTimersAtom, store, tagsAtom } from "./atoms";
import { useForm } from "react-hook-form";
import { Project } from "./interfaces";
import type TogglPlugin from "./main";

export class TimerDetailModal extends Modal {
	private root: Root | null = null

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		this.root = createRoot(contentEl)
		const queryClient = new QueryClient()
		const Content = TimerDetailModal.Content
		const close = this.close.bind(this)
		this.root.render(
			<StrictMode>
				<Provider store={store}>
					<QueryClientProvider client={queryClient}>
						<Content close={close} />
					</QueryClientProvider>
				</Provider>
			</StrictMode>
		)
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	static Content = ({ close }: { close: () => void }) => {
		const form = useForm<{
			projectId: string;
			tagIds: string[]
			description: string
		}>()
		const projects = useAtomValue(activeProjectsAtom)
		const tags = useAtomValue(tagsAtom)
		const projectOptions = projects.map(project => {
			return <option value={project.id} key={project.id}>{project.name}</option>
		})
		const tagOptions = tags.map(tag => {
			return <option value={tag.id} key={tag.id}>{tag.name}</option>
		})
		const setSavedTimers = useSetAtom(savedTimersAtom)
		return (
			<form style={{
				display: "flex",
				flexDirection: "column",
				gap: "1rem"
			}}
				onSubmit={form.handleSubmit((data) => {
					setSavedTimers(prev => {
						return [...prev, {
							...data,
							projectName: projects.find(project => project.id.toString() === data.projectId)?.name ?? "",
							tags: data.tagIds.map(tagId => tags.find(tag => tag.id.toString() === tagId)?.name ?? ""),
							projectId: parseInt(data.projectId),
							tagIds: data.tagIds.map(tagId => parseInt(tagId)),
						}]
					})
					close()
				})}
			>
				<label>
					<span>Project: </span>
					<select {...form.register("projectId")} aria-placeholder="Project" >
						{projectOptions}
					</select>
				</label>
				<label>
					<span>Description: </span>
					<input {...form.register("description")} placeholder="Description" />
				</label>
				<label>
					<span>Tags: </span>
					<select {...form.register("tagIds")} aria-placeholder="Tags" multiple >
						<option value="" disabled>Tags</option>
						{tagOptions}
					</select>
				</label>

				<footer>
					<button onClick={close}>Cancel</button>
					<button type="submit">Save</button>
				</footer>
			</form>
		)
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
		const queryClient = new QueryClient()
		const Content = TimerListModal.Content
		const close = this.close.bind(this)
		this.root.render(
			<StrictMode>
				<Provider store={store}>
					<QueryClientProvider client={queryClient}>
						<Content plugin={this.plugin} close={close} />
					</QueryClientProvider>
				</Provider>
			</StrictMode>
		)
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	static Content = ({ plugin, close }: { plugin: TogglPlugin, close?: () => void }) => {
		const me = useAtomValue(meAtom)
		const timers = useAtomValue(savedTimersAtom)
		const projects = useAtomValue(projectsAtom)
		const projectDict = useMemo(() => Object.fromEntries(
			projects.map(project => [project.id, project])
		), [projects])
		const findProject = (projectId: number): Project | undefined => projectDict[projectId]
		const mutationFn = plugin.togglService.api.createTimeEntry.bind(
			plugin.togglService.api
		) as typeof plugin.togglService.api.createTimeEntry
		const setCurrentEntry = useSetAtom(currentEntryAtom)

		const mutation = useMutation(
			{
				mutationFn,
				onSuccess: (entry) => {
					setCurrentEntry(entry.data)
					close?.()
				}
			}
		)

		const onStart = (timer: typeof timers[0]) => {
			mutation.mutate({
				...timer,
				workspaceId: me!.default_workspace_id,
				billable: false,
				start: new Date().toISOString(),
				createdWith: "obsidian-toggl-plugin"
			})
		}

		return (
			<ul>
				{timers.map((timer, index) => {
					const project = findProject(timer.projectId)
					return <li key={index} style={{
						display: "flex",
						gap: "1rem"
					}}>
						<button onClick={() => onStart(timer)}>Start</button>
						<div>
							<div style={{ color: project?.color }}>{timer.projectName}</div>
							<div>{timer.description}</div>
							<div>{timer.tags.join(",")}</div>
						</div>
					</li>
				})}
			</ul>
		)
	}
}

