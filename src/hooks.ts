import { createContext, useContext } from "react"
import type TogglPlugin from "./main"
import { useMutation } from "@tanstack/react-query"
import { useAtom, useSetAtom } from "jotai"
import { currentEntryAtom, meAtom, passedSecondsAtom } from "./atoms"
import { produce } from "immer"
import { isActiveEntry } from "./utils"
import { Timer } from "./interfaces"

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const PluginContext = createContext<TogglPlugin>(null!)

export const usePlugin = () => {
	return useContext(PluginContext)
}

export const useStopTimerMutation = (timerId?: string) => {
	const plugin = usePlugin()
	const setMe = useSetAtom(meAtom)
	return useMutation({
		mutationFn: (params: { timeEntryId: number, workspaceId: number }) => plugin.togglService.api.stopTimeEntry(params),
		mutationKey: ["stopTimeTimer", timerId],
		onSuccess: (data) => {
			setMe((me) => produce(me, (draft) => {
				if (!draft) {
					return
				}
				const ongoingTimerIndex = draft.time_entries.findIndex((entry) => isActiveEntry(entry))
				if (ongoingTimerIndex) {
					draft.time_entries[ongoingTimerIndex] = data
				} else {
					draft.time_entries.unshift(data)
				}
			}))
		}
	})
}

export const useRefreshMutation = () => {
	const plugin = usePlugin()
	const setMe = useSetAtom(meAtom)
	const setCurrentEntry = useSetAtom(currentEntryAtom)
	return useMutation({
		mutationFn: () => plugin.togglService.api.getMe(),
		mutationKey: ["refresh"],
		onSuccess: (data) => {
			setMe(data)
			const currentEntry = data.time_entries.find(e => e.duration === -1) ?? null
			setCurrentEntry(currentEntry)
		}
	})
}


export const useStartTimerMutation = (onSuccess?: () => void) => {
	const plugin = usePlugin()
	const [me, setMe] = useAtom(meAtom)
	const setCurrentEntry = useSetAtom(currentEntryAtom)
	const setPassedSeconds = useSetAtom(passedSecondsAtom)
	return useMutation({
		mutationFn: (timer: Timer) => plugin.togglService.api.createTimeEntry({
			...timer,
			workspaceId: me!.default_workspace_id,
			billable: false,
			start: new Date().toISOString(),
			createdWith: "obsidian-toggl-plugin"
		}),
		onSuccess: (entry) => {
			setPassedSeconds(window.moment().diff(window.moment(entry.start), 'seconds'))
			setCurrentEntry(entry)
			onSuccess?.()
			setMe(prev => produce(prev, draft => {
				if (draft) {
					const oldEntries = (draft?.time_entries ?? []).filter(entry => !isActiveEntry(entry))
					draft.time_entries = [...oldEntries, entry]
				}
				return draft
			}))
		}
	})
}


export const useCreateProjectMutation = () => {
	const plugin = usePlugin()
	const [me, setMe] = useAtom(meAtom)
	return useMutation({
		mutationFn: ({name, color}: { name: string, color: string }) => plugin.togglService.api.createProject({
			workspace_id: me!.default_workspace_id,
			billable: null,
			active: true,
			name,
			color,
			auto_estimates: false,
			cid: me!.clients?.[0].id,
			client_id: null,
			currency: null,
			estimated_hours: null,
			is_private: true,
			recurring: false,
			template: null,
			template_id: null,
		}),
		onSuccess: (project) => {
			setMe(prev => produce(prev, draft => {
				if (draft) {
					draft.projects.push(project)
				}
				return draft
			}))
		}
	})
}

export const useCreateTagMutation = () => {
	const plugin = usePlugin()
	const [me, setMe] = useAtom(meAtom)
	return useMutation({
		mutationFn: (name: string) => plugin.togglService.api.createTag({
			workspaceId: me!.default_workspace_id,
			name
		}),
		onSuccess: (tag) => {
			setMe(prev => produce(prev, draft => {
				if (draft) {
					draft.tags.push(tag)
				}
				return draft
			}))
		}
	})
}