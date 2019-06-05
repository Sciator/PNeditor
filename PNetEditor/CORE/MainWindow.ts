﻿import { app, dialog, ipcRenderer } from 'electron';
import { TabControl } from "./TabControl/TabControl";
import d3 = require("d3");
import { html } from "../Editor/Constants";
import * as file from 'fs';
import * as path from 'path';
import { PNModel } from "../Editor/Models/PNet/PNModel";
import { PNEditor } from '../Editor/PNEditor';

export var tabControl: TabControl;



export function InitWindow() {
    InitSettings();
    InitTabControl();
    InitFileButtons();
}


export var userDefaultNetSavePath: string;
export var userQuickNetSavePath: string;
function InitSettings() {
}

function InitFileButtons() {
    const buttonNew = d3.select("#buttonNew");
    const buttonLoad = d3.select("#buttonLoad");
    const buttonSave = d3.select("#buttonSave");
    const buttonClose = d3.select("#buttonClose");

    buttonNew.on("click", () => {
        tabControl.addTab();
    })

    function load(path: string) {
        try {
            const objString = file.readFileSync(path, { encoding: "utf8" });
            const jsonNet = JSON.parse(objString);
            const net = (new PNModel());

            // todo: eskalace
            if (net.fromJSON(jsonNet)) { }

            console.log("%c LOADED net", "color: rgb(0, 0, 255)");

            const tab = tabControl.addTab();
            new PNEditor(tab, net);
        } catch (ex) {
            console.error("cannot read file " + path);
            console.error(ex)
            return false;
        }

        return true;
    };
    ipcRenderer.on("load-dialog-response", (e: any, path: string) => {
        console.debug(path);
        load(path);
    });
    buttonLoad.on("click", () => {
        let objString: string;
        ipcRenderer.send('load-dialog');
    });


}


function InitTabControl() {
    const tabsButtons = d3.select("." + html.classes.page.controlPanelTabs);
    const content = d3.select("#content");

    tabControl = new TabControl(tabsButtons, content);

    //const tabbb = tabControl.addTab();
    //tabControl.addTab(tabbb.parentTabGroup);
}
