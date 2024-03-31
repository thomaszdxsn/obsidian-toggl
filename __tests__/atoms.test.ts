import { passedSecondsAtom, passedTimeAtom, currentTimerAtom, currentEntryAtom, savedTimersAtom, meAtom, projectsAtom, activeProjectsAtom, projectDictAtom, myTimeEntriesAtom, todayTimeEntriesAtom, currentEntryProjectAtom} from '../src/atoms'
import { createRandomMe, createRandomProject, createRandomTimeEntry, createRandomTimer } from '../mock'
import { createStore } from 'jotai'

let store = createStore()

afterEach(() => {
  store = createStore()
})


it("currentTimerAtom should react when currentEntryAtom and savedTimersAtom matched", () => {
  expect(store.get(currentTimerAtom)).toBe(null)
  const currentEntry = createRandomTimeEntry({
    project_id: 1,
    description: "test",
    tag_ids: []
  })
  store.set(currentEntryAtom, currentEntry)
  const timer = createRandomTimer({
    projectId: 1,
    description: "test",
    tagIds: []
  })
  store.set(savedTimersAtom, [timer])
  expect(store.get(currentTimerAtom)).toStrictEqual(timer)
})

it("passedTimeAtom should react when passedSecondsAtom changed", () => {
  expect(store.get(passedTimeAtom)).toBe(null)
  const passedSeconds = 100
  store.set(passedSecondsAtom, passedSeconds)
  expect(store.get(passedTimeAtom)).toBe("00:01:40")
})

it("projectsAtom should react when meAtom changed", () => {
  expect(store.get(projectsAtom)).toStrictEqual([])
  const project = createRandomProject()
  const me = createRandomMe({projects: [project]})
  store.set(meAtom, me)
  expect(store.get(projectsAtom)).toStrictEqual([project])
})

it("activeProjectsAtom should react when meAtom changed", () => {
  expect(store.get(activeProjectsAtom)).toStrictEqual([])
  const projects = [
    createRandomProject({active: false}),
    createRandomProject({active: true}),
    createRandomProject({active: false}),
  ]
  const me = createRandomMe({projects: projects})
  store.set(meAtom, me)
  expect(store.get(activeProjectsAtom)).toStrictEqual([projects[1]])
})

it("projectDictAtom should react when meAtom changed", () => {
  expect(store.get(projectDictAtom)).toStrictEqual({})
  const project = createRandomProject()
  const me = createRandomMe({projects: [project]})
  store.set(meAtom, me)
  expect(store.get(projectDictAtom)).toStrictEqual({[project.id]: project})
})

it("myTimeEntriesAtom should react when meAtom changed", () => {
  expect(store.get(myTimeEntriesAtom)).toStrictEqual([])
  const timeEntry = createRandomTimeEntry()
  const me = createRandomMe({time_entries: [timeEntry]})
  store.set(meAtom, me)
  expect(store.get(myTimeEntriesAtom)).toStrictEqual([timeEntry])
})

it("todayTimeEntriesAtom should react when myTimeEntriesAtom changed", () => {
  expect(store.get(todayTimeEntriesAtom)).toStrictEqual([])
  const entries = [
    createRandomTimeEntry({start: new Date().toISOString()}),
    createRandomTimeEntry({start: "2021-01-02T00:00:00Z"}),
    createRandomTimeEntry({start: "2021-01-03T00:00:00Z"}),
  ]
  const me = createRandomMe({time_entries: entries})
  store.set(meAtom, me)
  expect(store.get(todayTimeEntriesAtom)).toStrictEqual([entries[0]]) 
})

it("currentEntryProjectAtom should react when currentEntryAtom changed", () => {
  expect(store.get(currentEntryProjectAtom)).toBe(null)
  const project = createRandomProject()
  const currentEntry = createRandomTimeEntry({project_id: project.id})
  store.set(currentEntryAtom, currentEntry)
  const me = createRandomMe({projects: [project]})
  store.set(meAtom, me)
  expect(store.get(currentEntryProjectAtom)).toStrictEqual(project)
})