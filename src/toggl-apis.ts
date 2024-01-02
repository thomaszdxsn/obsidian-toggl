import axios, { AxiosError, AxiosInstance } from 'axios'


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
}

export class TogglService {
	public api: TogglAPI
	public currentEntry: TimeEntry | null = null

	constructor(apiToken: string) {
		this.api = new TogglAPI(apiToken)
	}

	tick(errorHandler?: (error: AxiosError<string>) => void, intervalTime = 10000,) {
		const interval = setInterval(async () => {
			try {
				const response = await this.api.getCurrentTimeEntry()
				this.currentEntry = response.data
			} catch (error) {
				this.currentEntry = null
				if (errorHandler) {
					errorHandler(error)
				}
				clearInterval(interval)
			}
		}, intervalTime)
	}

}



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
