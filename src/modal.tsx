import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";
import { App, Modal } from "obsidian";
import React, { StrictMode } from 'react'
import { Root, createRoot } from "react-dom/client";
import { store } from "./atoms";

export class TimerDetailModal extends Modal {
	private root: Root | null = null

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		this.root = createRoot(contentEl)
		const queryClient = new QueryClient()
		const Content = TimerDetailModal.Content
		this.root.render(
			<StrictMode>
				<Provider store={store}>
					<QueryClientProvider client={queryClient}>
						<Content />
					</QueryClientProvider>
				</Provider>
			</StrictMode>
		)
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	static Content = () => {
		return (
			<div>
				Timer
			</div>
		)
	}
}


export class TimerListModal extends Modal {
	private root: Root | null = null

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		this.root = createRoot(contentEl)
		const queryClient = new QueryClient()
		const Content = TimerListModal.Content
		this.root.render(
			<StrictMode>
				<Provider store={store}>
					<QueryClientProvider client={queryClient}>
						<Content />
					</QueryClientProvider>
				</Provider>
			</StrictMode>
		)
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	static Content = () => {
		return (
			<div>
				Timer List
			</div>
		)
	}
}