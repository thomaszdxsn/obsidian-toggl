// Docs: https://developers.track.toggl.com/docs/api/me

export interface Me {
	api_token: string
	at: string
	beginning_of_week: number
	clients: Client[]
	country_id: number
	created_at: string
	default_workspace_id: number
	email: string
	fullname: string
	has_password: boolean
	id: number
	image_url: string
	intercom_hash: string
	oauth_providers: string[]
	openid_enabled: boolean
	openid_email: string
	options: {
		additionalProperties: Record<string, unknown>
	}
	projects: Project[]
	tags: Tag[]
	tasks: Task[]
	time_entries: TimeEntry[]
	timezone: string
	updated_at: string
	workspaces: Workspace[]
}

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

export interface Client {
	archived: boolean
	at: string
	id: number
	name: string
	server_deleted_at: string
	wid: number
}

export interface Project {
	active: boolean
	actual_hours: number | null
	actual_seconds: number | null
	at: string
	auto_estimates: boolean | null
	billable: boolean | null
	cid: number
	client_id: number | null
	color: string
	created_at: string
	currency: string | null
	current_period: RecurringPeriod
	end_date: string
	estimated_hours: number | null
	estimated_seconds: number | null
	fixed_fee: number
	id: number
	is_private: boolean
	name: string
	rate: number
	rate_last_updated: string | null
	recurring: boolean
	recurring_parameters: RecurringProjectParameters[]
	server_deleted_at: string | null
	start_date: string
	status: string
	template: boolean | null
	template_id: number | null
	wid: number
	workspace_id: number
}

export interface Tag {
	at: string
	deleted_at: string
	id: number
	name: string
	workspace_id: number
}

export interface Task {
	at: string
	active: boolean
	estimated_seconds: number | null
	id: number
	name: string
	project_id: number
	recurring: boolean
	server_deleted_at: string | null
	tracked_seconds: number
	user_id: number | null
	workspace_id: number
}

export interface Workspace {
	admin: boolean
	api_token: string
	at: string
	business_ws: boolean
	csv_upload: CsvUpload
	default_currency: string
	default_hourly_rate: number
	ical_enabled: boolean
	ical_url: string
	id: number
	last_modified: string
	logo_url: string
	max_data_retention_days: number
	name: string
	only_admins_may_create_projects: boolean
	only_admins_may_create_tags: boolean
	only_admins_see_billable_rates: boolean
	only_admins_see_team_dashboard: boolean
	organization_id: number
	premium: boolean
	profile: number
	projects_billable_by_default: boolean
	rate_last_updated: string
	reports_collapse: boolean
	role: string
	rounding: number
	rounding_minutes: number
	server_deleted_at: string
	subscription: Subscription
	suspended_at: string
	te_constraints: TimeEntryConstraints
	working_hours_in_minutes: number
}

export interface RecurringPeriod {
	at: string
}
export interface RecurringProjectParameters {
	at: string
}
export interface CsvUpload {
	at: string
}
export interface Subscription {
	at: string
}
export interface TimeEntryConstraints {
	at: string
}


export interface Timer {
	projectId: number
	projectName: string
	description: string
	tags: string[]
	tagIds: number[]
}