import { Notice, Plugin, WorkspaceLeaf } from "obsidian";
import { SettingTab } from "./plugin/setting-tab";
import { TogglService } from "./toggl-apis";
import { TogglView, VIEW_TYPE_TOGGL } from "./plugin/views";
import {
  currentEntryProjectAtom,
  passedTimeAtom,
  savedTimersAtom,
  store,
  tick,
} from "./atoms";
import { Timer } from "./interfaces";
import { produce } from "immer";
import { TimerListModal } from "./plugin/modal";

interface PluginSettings {
  apiToken: string;
  showInStatusBar: boolean;
}

export default class TogglPlugin extends Plugin {
  public settings: PluginSettings;
  public togglService: TogglService;
  private statusBarItem: HTMLElement | null = null;
  private tickInterval: number | null = null;
  private serviceTickInterval: number | null = null;
  private statusUnsubscriber: (() => void) | null = null;
  private savedTimersUnsubscriber: (() => void) | null = null;
  private pluginData: PluginData;

  async onload() {
    this.pluginData = new PluginData(this);
    await Promise.all([this.loadSavedTimers(), this.loadSettings()]);
    this.addSettingTab(new SettingTab(this.app, this));
    this.startTick();
    this.showStatusBarItem();
    this.registerView(VIEW_TYPE_TOGGL, (leaf) => new TogglView(leaf, this));
    this.addRibbonIcon("clock", "Activate toggl view", () => {
      this.initView();
    });
    this.addCommand({
      id: "start-timer",
      name: "Start Timer",
      callback: () => {
        new TimerListModal(this.app, this).open();
      },
    });
    this.app.workspace.onLayoutReady(() => {
      this.initView()
    })

  }

  onunload() {
    if (this.tickInterval) {
      window.clearInterval(this.tickInterval);
    }
    if (this.savedTimersUnsubscriber) {
      this.savedTimersUnsubscriber();
    }
    if (this.serviceTickInterval) {
      window.clearInterval(this.serviceTickInterval);
    }
  }

  async loadSettings() {
    this.settings = await this.pluginData.loadSettings();
  }

  async loadSavedTimers() {
    const timers = await this.pluginData.loadTimers();
    store.set(savedTimersAtom, timers);
    this.savedTimersUnsubscriber = store.sub(savedTimersAtom, () => {
      const timers = store.get(savedTimersAtom);
      this.pluginData.saveTimers(timers);
    });
  }

  async saveSettings() {
    await this.pluginData.saveSettings(this.settings);
  }

  async initView() {
    const { workspace } = this.app;
    let leaf: WorkspaceLeaf
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_TOGGL);

    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      const rightLeaf = workspace.getRightLeaf(false);
      if (!rightLeaf) {
        return
      }
      leaf = rightLeaf
      await leaf.setViewState({
        type: VIEW_TYPE_TOGGL,
        active: true,
      });
    }

    workspace.revealLeaf(leaf);
  }

  startTick() {
    this.togglService = new TogglService(this.settings.apiToken);
    this.serviceTickInterval = this.togglService.tick();
    this.tickInterval = tick();
  }

  showStatusBarItem() {
    const statusBarItem = this.addStatusBarItem();
    this.statusBarItem = statusBarItem;
    this.statusUnsubscriber = store.sub(passedTimeAtom, () => {
      const passedTime = store.get(passedTimeAtom);
      if (!passedTime) {
        statusBarItem.setText("--");
        return;
      }
      const projectName = store.get(currentEntryProjectAtom)?.name ?? "";
      const text = [projectName, passedTime].filter(Boolean).join(" ");
      statusBarItem.setText(text);
    });
  }

  hideStatusBarItem() {
    this.statusBarItem?.remove();
    this.statusBarItem = null;
    this.statusUnsubscriber?.();
    this.statusUnsubscriber = null;
  }
}

interface Data {
  settings?: PluginSettings;
  savedTimers?: Timer[];
}

class PluginData {
  plugin: TogglPlugin;
  static DEFAULT_SETTINGS: PluginSettings = {
    apiToken: "",
    showInStatusBar: true,
  };

  constructor(plugin: TogglPlugin) {
    this.plugin = plugin;
  }

  async getData(): Promise<Data> {
    return this.plugin.loadData().then((data) => data ?? {}) as Promise<Data>;
  }

  async saveData(data: Data): Promise<void> {
    await this.plugin.saveData(data);
  }

  async saveSettings(settings: PluginSettings): Promise<void> {
    await this.saveData(
      produce(await this.getData(), (draft) => {
        draft.settings = settings;
        return draft;
      }),
    );
  }

  async saveTimers(timers: Timer[]): Promise<void> {
    await this.saveData(
      produce(await this.getData(), (draft) => {
        draft.savedTimers = timers;
        return draft;
      }),
    );
  }

  async loadSettings(): Promise<PluginSettings> {
    const data = await this.getData();
    return data.settings ?? PluginData.DEFAULT_SETTINGS;
  }

  async loadTimers(): Promise<Timer[]> {
    const data = await this.getData();
    return data?.savedTimers ?? [];
  }
}
