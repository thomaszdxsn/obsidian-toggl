import { Notice, Plugin, WorkspaceLeaf } from 'obsidian';
import { SettingTab } from './setting-tab';
import { TogglService } from './toggl-apis';
import dayjs from 'dayjs'
import { formatSeconds } from './utils';
import { TogglView, VIEW_TYPE_TOGGL } from './views'

interface PluginSettings {
	apiToken: string;
	showInStatusBar: boolean
}


export default class TogglPlugin extends Plugin {
	public settings: PluginSettings;
	public togglService: TogglService;
	private statusBarItem: HTMLElement | null = null

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SettingTab(this.app, this));
		this.startTick()
		this.showStatusBarItem()
		this.registerView(
			VIEW_TYPE_TOGGL,
			(leaf) => new TogglView(leaf, this)
		)
		this.addRibbonIcon("dice", 'Activate Toggl View', () => {
			this.initView()
		})
		if (this.app.workspace.layoutReady) {
			await this.initView();
		} else {
			this.registerEvent(
				this.app.workspace.on("layout-change", this.initView.bind(this))
			);
		}
	}

	onunload() {
		this.app.workspace.getLeavesOfType(VIEW_TYPE_TOGGL).forEach((leaf) => leaf.detach())
	}

	async loadSettings() {
		this.settings = Object.assign({}, {
			showInStatusBar: true,
			apiToken: ""
		}, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async initView() {
		const { workspace } = this.app
		let leaf: WorkspaceLeaf
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_TOGGL)

		if (leaves.length > 0) {
			leaf = leaves[0]
		} else {
			leaf = workspace.getRightLeaf(false)
			await leaf.setViewState({
				type: VIEW_TYPE_TOGGL,
				active: true
			})
		}

		workspace.revealLeaf(leaf)
	}

	startTick() {
		this.togglService = new TogglService(this.settings.apiToken);
		this.togglService.tick(error => {
			if (error.response?.data) {
				new Notice(`Toggl API Error: ${error.response.data}`, 3000)
			}
		});
	}

	showStatusBarItem() {
		const statusBarItem = this.addStatusBarItem();
		this.statusBarItem = statusBarItem
		setInterval(() => {
			const currentEntry = this.togglService.currentEntry
			if (!currentEntry) {
				statusBarItem.setText("--")
				return
			} else {
				const passedSeconds = dayjs().diff(dayjs(currentEntry.start), 'second')
				const projectName = this.togglService.currentEntryProject?.name ?? ""
				const text = [projectName, formatSeconds(passedSeconds)].filter(Boolean).join("-")
				statusBarItem.setText(text)
				statusBarItem.title = currentEntry.description ?? ""
			}
		})
	}

	hideStatusBarItem() {
		this.statusBarItem?.remove()
		this.statusBarItem = null
	}
}
