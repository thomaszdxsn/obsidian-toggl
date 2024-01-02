import axios, { AxiosError, AxiosInstance } from 'axios'
import { currentEntryAtom, meAtom, store } from './atoms'
import { Me, TimeEntry } from './interfaces'


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

	async stopTimeEntry(timeEntry: TimeEntry) {
		const response = await this.client.patch(
			`v9/workspaces/${timeEntry.workspace_id}/time_entries/${timeEntry.id}/stop`,
		)
		return response
	}

	async createTimeEntry({
		workspaceId,
		duration=-1,
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

	private async fetchMe() {
		return this.api.getMe().then(response => {
			store.set(meAtom, response.data)
		})
	}


	tick(errorHandler?: (error: AxiosError<string>) => void, intervalTime = 10000,) {
		const intervalHandler = async (onError?: () => void) => {
			try {
				const response = await this.api.getCurrentTimeEntry()
				store.set(currentEntryAtom, response.data)
			} catch (error) {
				store.set(currentEntryAtom, null)
				if (errorHandler) {
					errorHandler(error)
				}
				onError?.()
			}
		}

		// run immediately on first call
		intervalHandler()
		this.fetchMe()

		const interval = setInterval(async () => {
			intervalHandler(() => clearInterval(interval))
		}, intervalTime)
	}

}

