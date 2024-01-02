import { Notice, Plugin } from 'obsidian';
import { SettingTab } from './setting-tab';
import { TogglService } from './toggl-apis';
import dayjs from 'dayjs'
import { formatSeconds } from './utils';

interface PluginSettings {
	apiToken: string;
}


export default class MyPlugin extends Plugin {
	public settings: PluginSettings;
	public togglService: TogglService;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SettingTab(this.app, this));
		this.tickStatusBar()
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, {}, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	tickStatusBar() {
		this.togglService = new TogglService(this.settings.apiToken);
		this.togglService.tick(error => {
			if (error.response?.data) {
				new Notice(`Toggl API Error: ${error.response.data}`, 3000)
			}
		});

		const statusBarItem = this.addStatusBarItem();
		setInterval(() => {
			const currentEntry = this.togglService.currentEntry
			if (!currentEntry) {
				statusBarItem.setText("--")
				return
			} else {
				const passedSeconds = dayjs().diff(dayjs(currentEntry.start), 'second')
				const text = formatSeconds(passedSeconds)
				statusBarItem.setText(text)
				statusBarItem.title = currentEntry.description ?? ""
			}
		})
	}
}
