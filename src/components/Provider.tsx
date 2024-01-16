import React, { StrictMode } from "react"
import { store } from "../atoms"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type TogglPlugin from "../main"
import { PluginContext } from "../hooks"
import {Provider as JotaiProvider} from 'jotai'

interface Props {
  children: React.ReactNode
  plugin: TogglPlugin
}

const queryClient = new QueryClient()

export const Provider = ({ children, plugin }: Props) => {
  return (
    <StrictMode>
      <JotaiProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <PluginContext.Provider value={plugin}>
            {children}
          </PluginContext.Provider>
        </QueryClientProvider>
      </JotaiProvider>
    </StrictMode>
  )
}