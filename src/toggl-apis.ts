import { currentEntryAtom, meAtom, passedSecondsAtom, store } from "./atoms";
import { Me, Project, Tag, TimeEntry } from "./interfaces";
import { RequestUrlParam, requestUrl } from "obsidian";

type ProjectParams = Pick<
  Project,
  | "active"
  | "auto_estimates"
  | "billable"
  | "cid"
  | "client_id"
  | "color"
  | "currency"
  | "estimated_hours"
  | "fixed_fee"
  | "is_private"
  | "name"
  | "rate"
  | "recurring"
  | "recurring_parameters"
  | "template"
  | "template_id"
  | "workspace_id"
> & {
  client_name?: string;
  rate_change_mode?: string;
  start_date?: string;
  end_date?: string;
};


class HTTPClient {
  private defaultHeaders?: Record<string, string>;
  private baseURL?: string;

  constructor({ baseURL, defaultHeaders }: { baseURL?: string, defaultHeaders?: Record<string, string> }) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
  }

  buildURL(path: string) {
    if (path.startsWith("http")) {
      return path
    }
    if (!this.baseURL) {
      return path
    }
    return `${this.baseURL}${path}`
  }

  get<T>(config: RequestUrlParam) {
    return requestUrl({
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...config.headers
      },
      url: this.buildURL(config.url),
      method: "GET"
    }).then(resp => resp.json()) as Promise<T>
  }

  post<T>(config: Omit<RequestUrlParam, "body"> & { body: string | Record<string, any> }) {
    return requestUrl({
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...config.headers
      },
      url: this.buildURL(config.url),
      body: JSON.stringify(config.body),
      method: "POST"
    }).then(resp => resp.json()) as Promise<T>
  }

  put<T>(config: Omit<RequestUrlParam, "body"> & { body: string | Record<string, any> }) {
    return requestUrl({
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...config.headers
      },
      url: this.buildURL(config.url),
      body: JSON.stringify(config.body),
      method: "PUT"
    }).then(resp => resp.json()) as Promise<T>
  }

  patch<T>(config: Omit<RequestUrlParam, "body"> & { body?: string | Record<string, any> }) {
    return requestUrl({
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...config.headers
      },
      url: this.buildURL(config.url),
      body: JSON.stringify(config.body),
      method: "PATCH"
    }).then(resp => resp.json()) as Promise<T>
  }

  delete<T>(config: RequestUrlParam) {
    return requestUrl({
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...config.headers
      },
      url: this.buildURL(config.url),
      method: "DELETE"
    }).then(resp => resp.json()) as Promise<T>
  }
}


export class TogglAPI {
  private client: HTTPClient;

  constructor(apiToken: string) {
    this.client = new HTTPClient({
      baseURL: "https://api.track.toggl.com/api/",
      defaultHeaders: {
        Authorization: `Basic ${btoa(`${apiToken}:api_token`)}`
      }
    })
  }

  async createProject(body: ProjectParams) {
    const response = await this.client.post<Project>(
      {
        url: `v9/workspaces/${body.workspace_id}/projects`,
        body
      }
    );
    return response;
  }

  async updateProject({
    projectId,
    data,
  }: {
    projectId: number;
    data: ProjectParams;
  }) {
    const response = await this.client.put<Project>({
      url: `v9/workspaces/${data.workspace_id}/projects/${projectId}`,
      body: data
    })
    return response;
  }

  async deleteProject({
    workspaceId,
    projectId,
  }: {
    workspaceId: number;
    projectId: number;
  }) {
    const response = await this.client.delete(
      {url: 
        `v9/workspaces/${workspaceId}/projects/${projectId}`
      }
    );
    return response;
  }

  async createTag({
    workspaceId,
    name,
  }: {
    workspaceId: number;
    name: string;
  }) {
    const response = await this.client.post<Tag>({
      url: `v9/workspaces/${workspaceId}/tags`,
      body: {
        workspaceId,
        name,
      },
    })
    return response
  }

  async updateTag({
    workspaceId,
    tagId,
    name,
  }: {
    workspaceId: number;
    tagId: number;
    name: string;
  }) {
    const response = await this.client.put<Tag>({
      url: `v9/workspaces/${workspaceId}/tags/${tagId}`,
      body: {
        workspaceId,
        name,
      }
    })
    return response
  }

  async deleteTag({
    workspaceId,
    tagId,
  }: {
    workspaceId: number;
    tagId: number;
  }) {
    const response = await this.client.delete({
      url: `v9/workspaces/${workspaceId}/tags/${tagId}`
    })
    return response;
  }

  async getCurrentTimeEntry() {
    const response = await this.client.get<TimeEntry | null>({
      url: "v9/me/time_entries/current"
    })
    return response;
  }

  async getMe(withRelatedData = true) {
    const params = new URLSearchParams({
      with_related_data: withRelatedData.toString(),
    });
    const response = await this.client.get<Me>({
      url: `v9/me?${params.toString()}`
    })
    return response;
  }

  async stopTimeEntry({
    timeEntryId,
    workspaceId,
  }: {
    timeEntryId: number;
    workspaceId: number;
  }) {
    const response = await this.client.patch<TimeEntry>({
      url: `v9/workspaces/${workspaceId}/time_entries/${timeEntryId}/stop`
    })
    return response;
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
    wid,
  }: {
    workspaceId: number;
    billable: boolean;
    createdWith: string;
    description: string;
    duration?: number;
    duronly?: boolean;
    pid?: number;
    projectId: number;
    start: string;
    startDate?: string;
    stop?: string;
    tagAction?: "add" | "delete";
    tagIds: number[];
    tags: string[];
    taskId?: number;
    tid?: number;
    uid?: number;
    userId?: number;
    wid?: number;
  }) {
    const body = {
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
        wid,
    }
    const response = await this.client.post<TimeEntry>({
      url: `v9/workspaces/${workspaceId}/time_entries`,
      body
    })
    return response;
  }
}

export class TogglService {
  public api: TogglAPI;

  constructor(apiToken: string) {
    this.api = new TogglAPI(apiToken);
  }

  tick(intervalTime = 1000 * 30) {
    const intervalHandler = async (onError?: () => void) => {
      try {
        const [currentEntry, me] = await Promise.all([
          this.api.getCurrentTimeEntry(),
          this.api.getMe(),
        ] as const);
        store.set(currentEntryAtom, currentEntry);
        store.set(meAtom, me);

        const passedSeconds = currentEntry?.start
          ? window.moment().diff(window.moment(currentEntry.start), "second")
          : null;
        store.set(passedSecondsAtom, passedSeconds);
      } catch (error) {
        store.set(currentEntryAtom, null);
        onError?.();
      }
    };

    // run immediately on first call
    intervalHandler();

    const interval = window.setInterval(async () => {
      intervalHandler(() => window.clearInterval(interval));
    }, intervalTime);

    return interval;
  }
}
