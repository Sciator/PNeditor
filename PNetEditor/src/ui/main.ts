import * as d3 from "d3";
import * as file from "fs";
import { ipcRenderer, remote } from "electron";
import { showModal, modalResult } from "./components/Modal";
import { TabControl } from "./components/TabControl/TabControl";
import { PNModel, JSONNet, netConfiguration } from "./Editor/PNet/PNModel";
import { PNEditor } from "./Editor/PNEditor";
import { html } from "../definitions/Constants";
import { TabKeyDownEvent } from "./components/TabControl/Tab";
import { TabGroup } from "./components/TabControl/TabGroup";

export let tabControl: TabControl;

export let userDefaultNetSavePath: string;
export let userQuickNetSavePath: string;
function InitSettings() {
}

const TabActions = {
  new: () => {
    const tab = tabControl.addTab();

    const net = new PNModel();
    const editor = new PNEditor(tab, net);
  },
  load: (path: string) => {
    try {
      const objString = file.readFileSync(path, { encoding: "utf8" });
      const jsonNet = JSON.parse(objString);
      const net = new PNModel();

      if (!net.fromJSON(jsonNet)) {
        throw Error("file corrupted");
      }

      console.log("%c LOADED net", "color: rgb(0, 0, 255)");

      const tab = tabControl.addTab();
      const editor = new PNEditor(tab, net);
      console.log(editor);

      editor.Path = path;
    } catch (ex) {
      showModal("cannot open file", "OK");

      console.error("cannot read file " + path);
      console.error(ex);
      return false;
    }

    return true;
  },
  save: (path: string) => {
    try {
      const obj = groupmap.get(tabControl.SelectedTab.parentTabGroup);
      if (!obj.IsSaveable())
        return;

      file.writeFileSync(path, obj.GetStringToSave(), { encoding: "utf8" });

      obj.Path = path;

      console.log("%c Saved net", "color: rgb(0, 0, 255)");
    } catch (ex) {
      showModal("cannot save file", "OK");

      console.error("cannot save file " + path);
      console.error(ex);
      return false;
    }

    return true;
  },
  close: () => {
    const tab = tabControl.SelectedTab;
    if (tab) {
      tab.remove();
    }
  },
  initDialog: {
    save: () => {

      const tab = tabControl.SelectedTab;
      if (!tab) {
        showModal("No tab selected, nothing to save.", "OK");
        return;
      }

      const obj = groupmap.get(tab.parentTabGroup);
      if (!obj.IsSaveable()) {
        showModal("Selected tab cannnot be saved.", "OK");
        return;
      }

      if (obj.Path) {
        showModal("Save to same file ?", "Yes", "Select file").then(result => {
          if (result === modalResult.btn0)
            TabActions.save(obj.Path);
          else if (result === modalResult.btn1)
            ipcRenderer.send("save-dialog");
        });
      } else
        ipcRenderer.send("save-dialog");
    },
    load: () => { ipcRenderer.send("load-dialog"); },
  },
};

function InitFileButtons() {
  const btn = html.id.controlPanel.buttons;
  const buttonNew = d3.select("#" + btn.new);
  const buttonLoad = d3.select("#" + btn.load);
  const buttonSave = d3.select("#" + btn.save);
  const buttonClose = d3.select("#" + btn.close);

  const c = "click";
  buttonNew.on(c, TabActions.new);
  buttonLoad.on(c, TabActions.initDialog.load);
  buttonSave.on(c, async () => {

    TabActions.initDialog.save();
  });
  buttonClose.on(c, TabActions.close);

  ipcRenderer.on("load-dialog-response", (e: any, path: string) => {
    console.debug(path);
    TabActions.load(path);
  });

  ipcRenderer.on("save-dialog-response", (e: any, path: string) => {
    TabActions.save(path);
  });

  groupmap = new Map();
}


function InitTabControl() {
  const tabsButtons = d3.select("." + html.classes.controlPanel.tabContainer);
  const content = d3.select("#" + html.id.content);

  tabControl = new TabControl(tabsButtons, content);

  document.addEventListener("keypress", (e) => {
    console.debug(e);

    const tab = tabControl.SelectedTab;
    if (tab) {
      const handler = (tab as any)._onKeyDownWhenOpened as (e: TabKeyDownEvent) => void;
      handler(e);
    }

    if (e.ctrlKey) {
      // todo: keycode
      // N
      if (e.keyCode === 14)
        TabActions.new();
      // O
      if (e.keyCode === 15)
        TabActions.initDialog.load();
      // S
      if (e.keyCode === 19)
        TabActions.initDialog.save();
    }
  });
}

export interface TabInterface {
  IsSaveable(): boolean;
  GetStringToSave(): string;
  Path: string;
}

export let groupmap: Map<TabGroup, TabInterface>;

async function main() {
  // called only once
  if ((window as any)["__main__"]) return; (window as any)["__main__"] = true;
  InitSettings();
  InitTabControl();
  InitFileButtons();

  const custom = (remote.getCurrentWindow() as any).custom;
}

window.addEventListener("load", main);
