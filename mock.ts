import { faker } from '@faker-js/faker'
import { Me, Project, Tag, TimeEntry, Timer } from 'src/interfaces'


export function createRandomTimeEntry(defaultValues?: Partial<TimeEntry>): TimeEntry {
  return {
    id: faker.number.int(),
    pid: faker.number.int(),
    project_id: faker.number.int(),
    description: faker.lorem.sentence(),
    duronly: faker.datatype.boolean(),
    wid: faker.number.int(),
    tags: [faker.lorem.word()],
    tag_ids: [faker.number.int()],
    start: faker.date.recent().toISOString(),
    stop: faker.date.recent().toISOString(),
    duration: faker.number.int(),
    billable: faker.datatype.boolean(),
    at: faker.date.recent().toISOString(),
    server_deleted_at: faker.date.recent().toISOString(),
    user_id: faker.number.int(),
    task_id: faker.number.int(),
    uid: faker.number.int(),
    tid: faker.number.int(),
    workspace_id: faker.number.int(),
    ...defaultValues
  }
}

export function createRandomProject(defaultValues?: Partial<Project>): Project {
  return {
    id: faker.number.int(),
    wid: faker.number.int(),
    cid: faker.number.int(),
    name: faker.lorem.word(),
    billable: faker.datatype.boolean(),
    is_private: faker.datatype.boolean(),
    active: faker.datatype.boolean(),
    at: faker.date.recent().toISOString(),
    created_at: faker.date.recent().toISOString(),
    color: faker.internet.color(),
    auto_estimates: faker.datatype.boolean(),
    actual_hours: faker.number.int(),
    rate: faker.number.float(),
    template: faker.datatype.boolean(),
    template_id: faker.number.int(),
    actual_seconds: faker.number.int(),
    client_id: faker.number.int(),
    currency: faker.finance.currencyCode(),
    current_period: {
      at: faker.date.recent().toISOString(),
    },
    end_date: faker.date.recent().toISOString(),
    estimated_hours: faker.number.int(),
    estimated_seconds: faker.number.int(),
    fixed_fee: faker.number.float(),
    rate_last_updated: faker.date.recent().toISOString(),
    recurring: faker.datatype.boolean(),
    start_date: faker.date.recent().toISOString(),
    server_deleted_at: faker.date.recent().toISOString(),
    status: faker.lorem.word(),
    workspace_id: faker.number.int(),
    ...defaultValues
  }
}

export function createRandomMe(defaultValues?: Partial<Me>): Me {
  return {
    api_token: faker.lorem.word(),
    at: faker.date.recent().toISOString(),
    beginning_of_week: faker.number.int(),
    clients: [],
    country_id: faker.number.int(),
    created_at: faker.date.recent().toISOString(),
    default_workspace_id: faker.number.int(),
    email: faker.internet.email(),
    fullname: faker.person.fullName(),
    has_password: faker.datatype.boolean(),
    id: faker.number.int(),
    image_url: faker.internet.url(),
    intercom_hash: faker.lorem.word(),
    oauth_providers: [],
    openid_enabled: faker.datatype.boolean(),
    openid_email: faker.internet.email(),
    options: {
      additionalProperties: {}
    },
    projects: [],
    tags: [],
    tasks: [],
    time_entries: [],
    timezone: faker.date.anytime().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    workspaces: [], 
    ...defaultValues
  }
}

export function createRandomTag(defaultValues?: Partial<Tag>): Tag {
  return {
    id: faker.number.int(),
    deleted_at: "",
    name: faker.lorem.word(),
    at: faker.date.recent().toISOString(),
    workspace_id: faker.number.int(),
    ...defaultValues
  }
}

export function createRandomTimer(defaultValues?: Partial<Timer>): Timer {
  return {
    projectId: faker.number.int(),
    projectName: faker.lorem.word(),
    tagIds: [faker.number.int()],
    tags: [faker.lorem.word()],
    description: faker.lorem.sentence(),
    ...defaultValues
  }
}