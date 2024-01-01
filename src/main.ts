import {Plugin} from 'obsidian';
import { SettingTab } from './setting-tab';

interface PluginSettings {
	apiToken: string;
}


export default class MyPlugin extends Plugin {
	public settings: PluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, {}, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
