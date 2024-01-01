import axios, { AxiosInstance } from 'axios'

// Docs: https://developers.track.toggl.com/

export interface TimeEntry {
	at: string
	billable: boolean
	description: string | null
	duration: number
	duronly: boolean
	id: number
	pid: number
	project_id: number | null
	server_deleted_at: string | null
	start: string
	stop: string
	tag_ids: number[]
	tags: string[]
	task_id: number | null
	uid: number
	tid: number
	user_id: number
	wid: number
	workspace_id: number
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

	async getCurrentTimeEntry() {
		const response = await this.client.get<TimeEntry | null>("v9/me/time_entries/current")
		return response.data
	}
}
