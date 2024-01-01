import { App, PluginSettingTab, Setting } from "obsidian";
import type MyPlugin from "./main";


export class SettingTab extends PluginSettingTab {
	private plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		const description = new DocumentFragment()
		const paragraph = createEl("p", {
			text: "Don't know how to get your API Token? "
		})
		paragraph.append(
			createEl("a", {
				href: "https://support.toggl.com/en/articles/3116844-where-is-my-api-key-located",
				text: "Click here",
			})
		)
		description.append(
			paragraph
		)

		containerEl.empty();

		new Setting(containerEl)
			.setName('API Token')
			.setDesc(description)
			.addText(text => text
				.setPlaceholder('Enter your API Token')
				.setValue(this.plugin.settings.apiToken)
				.onChange(async (value) => {
					this.plugin.settings.apiToken = value;
					await this.plugin.saveSettings();
				}));
	}
}
