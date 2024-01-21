import axios, { AxiosError, AxiosInstance } from 'axios'
import { currentEntryAtom, meAtom, store } from './atoms'
import { Me, Project, Tag, TimeEntry } from './interfaces'


type ProjectParams = Pick<Project, 'active' | "auto_estimates" | "billable" | "cid"
	| "client_id" | "color" | "currency" | "estimated_hours"
	| "fixed_fee" | "is_private" | "name" | "rate"
	| "recurring" | "recurring_parameters" 
	| "template" | "template_id" | "workspace_id"
> & {
	client_name?: string
	rate_change_mode?: string
	start_date?: string
	end_date?: string
}


export class TogglAPI {
	private client: AxiosInstance

	constructor(apiToken: string) {
		this.client = axios.create({
			baseURL: "https://api.track.toggl.com/api/",
			auth: {
				username: apiToken,
				password: "api_token"
			},
		})
	}


	async createProject(
		data: ProjectParams) {
		const response = await this.client.post<Project>(`v9/workspaces/${data.workspace_id}/projects`, data)
		return response
	}

	async updateProject({ projectId, data }: {
		projectId: number
		data: ProjectParams
	}) {
		const response = await this.client.put<Project>(`v9/workspaces/${data.workspace_id}/projects/${projectId}`, data)
		return response
	}

	async deleteProject({ workspaceId, projectId }: { workspaceId: number, projectId: number }) {
		const response = await this.client.delete(`v9/workspaces/${workspaceId}/projects/${projectId}`)
		return response
	}

	async createTag({workspaceId, name}: {workspaceId: number, name: string}) {
		const response = await this.client.post<Tag>(`v9/workspaces/${workspaceId}/tags`, {
			workspaceId,
			name
		})
		return response
	}

	async updateTag({workspaceId, tagId, name}: {workspaceId: number; tagId: number; name: string}) {
		const response = await this.client.put<Tag>(`v9/workspaces/${workspaceId}/tags/${tagId}`, {
			workspaceId,
			name
		})
		return response
	}

	async deleteTag({workspaceId, tagId}: {workspaceId: number; tagId: number}) {
		const response = await this.client.delete(`v9/workspaces/${workspaceId}/tags/${tagId}`)
		return response
	}

	async getCurrentTimeEntry() {
		const response = await this.client.get<TimeEntry | null>("v9/me/time_entries/current")
		return response
	}

	async getMe(withRelatedData = true) {
		const response = await this.client.get<Me>("v9/me", {
			params: {
				"with_related_data": withRelatedData.toString()
			}
		})
		return response
	}

	async stopTimeEntry({ timeEntryId, workspaceId }: { timeEntryId: number, workspaceId: number }) {
		const response = await this.client.patch<TimeEntry>(
			`v9/workspaces/${workspaceId}/time_entries/${timeEntryId}/stop`,
		)
		return response
	}

	async createTimeEntry({
		workspaceId,
		duration = -1,
		duronly,
		pid,
		projectId,
		billable,
		createdWith,
		description,
		start,
		startDate,
		stop,
		tagAction,
		tagIds,
		tags,
		taskId,
		tid,
		uid,
		userId,
		wid
	}: {
		workspaceId: number,
		billable: boolean,
		createdWith: string
		description: string
		duration?: number
		duronly?: boolean
		pid?: number
		projectId: number
		start: string
		startDate?: string,
		stop?: string,
		tagAction?: "add" | "delete",
		tagIds: number[]
		tags: string[];
		taskId?: number
		tid?: number,
		uid?: number,
		userId?: number
		wid?: number
	}) {
		const response = await this.client.post<TimeEntry>(`v9/workspaces/${workspaceId}/time_entries`, {
			workspace_id: workspaceId,
			duration,
			duronly,
			pid,
			project_id: projectId,
			billable,
			created_with: createdWith,
			description,
			start,
			start_date: startDate,
			stop,
			tag_action: tagAction,
			tag_ids: tagIds,
			tags: tags,
			task_id: taskId,
			tid,
			uid,
			user_id: userId,
			wid
		})
		return response
	}
}

export class TogglService {
	public api: TogglAPI

	constructor(apiToken: string) {
		this.api = new TogglAPI(apiToken)
	}

	tick( intervalTime = 1000 * 30,) {
		const intervalHandler = async (onError?: () => void) => {
			try {
				const [currentEntry, me] = await Promise.all([
					this.api.getCurrentTimeEntry(),
					this.api.getMe()
				] as const)
				store.set(currentEntryAtom, currentEntry.data)
				store.set(meAtom, me.data)
			} catch (error) {
				store.set(currentEntryAtom, null)
				onError?.()
			}
		}

		// run immediately on first call
		intervalHandler()

		const interval = setInterval(async () => {
			intervalHandler(() => clearInterval(interval))
		}, intervalTime)
	}

}

