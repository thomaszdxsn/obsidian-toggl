import { faker } from '@faker-js/faker'
import { Project, TimeEntry } from 'src/interfaces'


export function createRandomTimeEntry(): TimeEntry {
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
  }
}

export function createRandomProject(): Project {
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
  }
}
