import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { Provider, useAtomValue, useSetAtom } from "jotai";
import { App, Modal } from "obsidian";
import React, { StrictMode, useMemo } from 'react'
import { Root, createRoot } from "react-dom/client";
import { activeProjectsAtom, currentEntryAtom, meAtom, projectsAtom, savedTimersAtom, store, tagsAtom } from "./atoms";
import { useForm } from "react-hook-form";
import { Project, Timer } from "./interfaces";
import type TogglPlugin from "./main";
import { css } from "@emotion/css";
import { ClipLoader } from "react-spinners";

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
		const closeModal = this.close.bind(this)
		this.root.render(
			<StrictMode>
				<Provider store={store}>
					<QueryClientProvider client={queryClient}>
						<Content closeModal={closeModal} />
					</QueryClientProvider>
				</Provider>
			</StrictMode>
		)
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	static Content = ({ closeModal: close }: { closeModal: () => void }) => {
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
				<label
					className={css`
						display: flex;
						flex-direction: column;
						gap: var(--size-4-1);
					`}
				>
					<span>Project</span>
					<select {...form.register("projectId")} aria-placeholder="Project"
					>
						{projectOptions}
					</select>
				</label>
				<label

					className={css`
						display: flex;
						flex-direction: column;
						gap: var(--size-4-1);
					`}
				>
					<span>Description</span>
					<input {...form.register("description")} placeholder="Description" />
				</label>
				<label
					className={css`
						display: flex;
						flex-direction: column;
						gap: var(--size-4-1);
					`}
				>
					<span>Tags</span>
					<select {...form.register("tagIds")} aria-placeholder="Tags" multiple 
						className={css`
							height: 120px;
						`}
					>
						<option value="" disabled>Tags</option>
						{tagOptions}
					</select>
				</label>

				<footer className={
					css`
						display: flex;
						gap: var(--size-4-2);
						justify-content: center;
					`
				}>
					<button
						onClick={close}
						disabled={form.formState.isSubmitting}
						className={css`
							cursor: pointer;
						`}
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={form.formState.isSubmitting}
						className={css`
							cursor: pointer;
						`}
					>
						Save
					</button>
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
						<div className={css`
							margin-top: var(--size-4-4);
						`}>

							<Content plugin={this.plugin} closeModal={close} />
						</div>
					</QueryClientProvider>
				</Provider>
			</StrictMode>
		)
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	static Content = ({ plugin, closeModal }: { plugin: TogglPlugin, closeModal?: () => void }) => {
		const timers = useAtomValue(savedTimersAtom)
		const projects = useAtomValue(projectsAtom)
		const projectDict = useMemo(() => Object.fromEntries(
			projects.map(project => [project.id, project])
		), [projects])
		const findProject = (projectId: number): Project | undefined => projectDict[projectId]

		return (
			<div className={css`
				display: grid;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				gap: var(--size-4-1);
			`}>
				{timers.map((timer, index) => {
					const project = findProject(timer.projectId)
					return <TimerListModal.TimerCard closeModal={closeModal} key={index} timer={timer} project={project} plugin={plugin} />
				})}
			</div>
		)
	}

	static TimerCard = ({ timer, plugin, project, closeModal }: { timer: Timer, project?: Project, plugin: TogglPlugin, closeModal?: () => void }) => {
		const me = useAtomValue(meAtom)
		const mutationFn = plugin.togglService.api.createTimeEntry.bind(
			plugin.togglService.api
		) as typeof plugin.togglService.api.createTimeEntry
		const setCurrentEntry = useSetAtom(currentEntryAtom)
		const mutation = useMutation(
			{
				mutationFn,
				onSuccess: (entry) => {
					setCurrentEntry(entry.data)
					closeModal?.()
				}
			}
		)

		const onStart = (timer: Timer) => {
			mutation.mutate({
				...timer,
				workspaceId: me!.default_workspace_id,
				billable: false,
				start: new Date().toISOString(),
				createdWith: "obsidian-toggl-plugin"
			})
		}
		return (
			<section className={css`
						background: var(--background-modifier-form-field);
						padding: var(--size-4-2);
						display: flex;
						flex-direction: column;
						gap: var(--size-4-2);
						border-radius: var(--radius-m);
					`}>
				<div className={css`
						display: flex;
						flex-direction: column;
				`}>
					<div style={{ color: project?.color }}>{timer.projectName}</div>
					<div
						className={css`
							font-size: var(--font-smallest);
							color: var(--text-muted);
						`}
					>{timer.description}</div>
					<div className={css`
						font-size: var(--font-ui-smaller);
						color: var(--text-accent);
					`}>{timer.tags.join(",")}</div>
				</div>
				<button onClick={() => onStart(timer)}
					disabled={mutation.isPending}
					className={css`
						cursor: ${mutation.isPending ? "wait" : "pointer"}
					`}
				>
					{mutation.isPending ? (
						<ClipLoader size={24}
							cssOverride={{
								borderColor: "var(--accent-h)",
							}}
						/>
					) : "Start"}
				</button>
			</section>
		)

	}
}

