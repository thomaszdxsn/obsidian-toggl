import { createContext, useContext } from "react"
import type TogglPlugin from "./main"
import { TimeEntry } from "./interfaces"
import { useMutation } from "@tanstack/react-query"

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const PluginContext = createContext<TogglPlugin>(null!)

export const usePlugin = () => {
	return useContext(PluginContext)
}

export const useStopTimerMutation = () => {
	const plugin = usePlugin()
	const mutationFn: (timer: TimeEntry) => Promise<void> = plugin.togglService.api.stopTimeEntry.bind(plugin.togglService.api)
	return useMutation({
		mutationFn: mutationFn
	})
}