﻿export enum Events { "Click" }
export enum Actions { "add", "remove", "edit", "move", "do" }
export type DoElementTarget = ("target" | "selected")[];

export type Dependencies = {
    main?: string,
    toggles?: { name: string, value: boolean }[]
}

export interface Model {
    elements: string[];
    Serialize(): JSON;
    Deserialize(input: JSON): void;

    Add(elementName: string, args?: any): void;
    Remove(elementName: string, args?: any): void;
    Edit(elementName: string, args?: any): void;
    Do(elementName: string, args?: any): void;
    //Move(elementName: string, args?: any): void;
}

export interface Settings {
    modes: {
        /** Main modes - must have at least one mode (default) */
        main: string[],
        /** Toggle/Switch buttons */
        toggles?:
        (string |
        {
            name: string,
            defaultState?: boolean,
            /** When is button shown */
            dependencies?: Dependencies
        })[],
    },
    actions:
    {
        on: {
            /** occured event */
            event: Events,
            /** currently selected element */
            selected?: string[],
            /** target of occured event */
            target?: string
        },
        /** if not present - event will ocur every time */
        when?: {
            /** current main mode */
            main?: string,
            toggles?: { name: string, state: boolean }[]
        },
        do?: { type: Actions, element?: DoElementTarget | string, args?: any }[],
        to?: {
            mode?: string,
            toggles?: [
                {
                    name: string,
                    changeTo: "switch" | boolean
                }
            ]
        }
    }[]
}
