import { atom, createStore } from "jotai";
import type { Me, TimeEntry, Timer } from "./interfaces";
import dayjs from "dayjs";
import { formatSeconds, isSameTimer } from "./utils";

/*
	# Basic Atoms
*/

export const store = createStore();

export const savedTimersAtom = atom<Timer[]>([])

export const currentEntryAtom = atom<TimeEntry | null>(null)

export const passedSecondsAtom = atom<number | null>(null)

export const meAtom = atom<Me | null>(null)

/*
	Derived Atoms
*/

export const currentTimerAtom = atom(get => {
	const currentEntry = get(currentEntryAtom)
	const savedTimers = get(savedTimersAtom)
	if (!currentEntry) {
		return null
	}
	return savedTimers.find(timer => isSameTimer({ timer, entry: currentEntry })) ?? null
})

export const passedTimeAtom = atom<string | null>(get => {
	const passedSeconds = get(passedSecondsAtom)
	if (!passedSeconds) {
		return null
	}
	return formatSeconds(passedSeconds)
})

export const tagsAtom = atom<Me["tags"]>(get => {
	const me = get(meAtom)
	return me?.tags ?? []
})

export const projectsAtom = atom<Me["projects"]>(get => {
	const me = get(meAtom)
	return me?.projects ?? []
})

export const activeProjectsAtom = atom(get => {
	const projects = get(projectsAtom)
	return projects.filter(project => project.active)
})

export const projectDictAtom = atom(get => {
	const projects = get(projectsAtom)
	return Object.fromEntries(projects.map(project => [project.id, project]))
})

const myTimeEntriesAtom = atom(get => {
	const me = get(meAtom)
	return me?.time_entries ?? []
})

export const todayTimeEntriesAtom = atom(get => {
	const entries = get(myTimeEntriesAtom)
	return entries.filter(entry => dayjs().isSame(entry.start, 'day'))
})

export const currentEntryProjectAtom = atom(get => {
	const currentEntry = get(currentEntryAtom)
	const projects = get(projectsAtom)
	if (!currentEntry) {
		return null
	}
	return projects.find(project => project.id === currentEntry.project_id)
})

/*
	Utilities
*/

export const tick = () => {
	const interval = setInterval(() => {
		const currentEntry = store.get(currentEntryAtom)
		if (!currentEntry) {
			store.set(passedSecondsAtom, null)
			return
		}
		const passedSeconds = dayjs().diff(dayjs(currentEntry.start), 'second')
		store.set(passedSecondsAtom, passedSeconds)
	}, 1000)
	return interval
}