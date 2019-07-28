﻿import { d3BaseSelector } from "../../../CORE/Constants";
import { JSONNet, netConfiguration } from "./PNModel";
import { DrawBase, Callbacks } from "../_Basic/DrawBase";
import { getArrayElementMapToNumber, convertToNumberingScheme } from "../../../Helpers/purify";

export type ConfigTransitionClickEvent = { configIndex: number, transitionID: number };
export type ConfigShowClickEvent = { configIndex: number };

export class PlaceTransitionTableDraw extends DrawBase {
    public models = {
        net: null as JSONNet,
        configurations: [] as netConfiguration[],
    };
    public Callbacks = {
        container: new Callbacks<{}>(),
    };
    protected Selectors = {
        table: null as d3BaseSelector,
    };
    // todo: v nastavení bude velikost textu tabulky
    protected _update(): void {
        const table = this.Selectors.table;
        const net = this.models.net;
        const configs = this.models.configurations;

        table.html("");

        const placeIndexes = net.places.map(x => x.id);
        const transitionIndexes = net.transitions.map(x => x.id);

        const makeHead = () => {
            const head = table.append("thead").append("tr");

            head.append("th").text("");

            const mapper = getArrayElementMapToNumber(placeIndexes);
            placeIndexes
                .forEach(x => {
                    const p = net.places.find(y => y.id === x);
                    head.append("th").text(convertToNumberingScheme(mapper(x)+1)).style("min-width", "1em");
                })

            head.append("th").style("background", "black");


            transitionIndexes.forEach(x => {
                const t = net.transitions.find(y => y.id === x);
                head.append("th").text(t.id).style("min-width", "1.1em");
            })
            return head;
        }
        makeHead();

        const tableBody = table.append("tbody");
        configs.forEach((c, ci) => {
            const row = tableBody.append("tr");

            const showbutton = row.append("td");
            showbutton
                .text("👁")
                .style("font-weight", "bold")
                .style("background", "white")
                .style("cursor", "pointer")
                .classed("unselectable", true)
                .on("mouseover", () => { showbutton.style("filter", "invert(1)") })
                .on("mouseout", () => { showbutton.style("filter", "") })
                .on("click", () => { this._onConfigShowClick({ configIndex: ci }); });

            placeIndexes.forEach(x => {
                const m = c.marking.find(y => y.id === x);
                row.append("td").text(m ? m.marking : 0);
            })

            row.append("td").style("background", "black");


            transitionIndexes.forEach(x => {
                const enabled = c.enabledTransitionsIDs.some(y => y === x);
                const isUsed = x === c.usedTransition;
                const color = isUsed ? "yellowgreen" : (enabled ? "green" : "lightgray");
                row.append("td")
                    .style("background", color)
                    .style("cursor", enabled ? "pointer" : "not-allowed")
                    .on("click", enabled ? () => { this._onConfigTransitionClick({ configIndex: ci, transitionID: x }); } : () => { })
                    .classed("unselectable", true)
                    .classed("bright-on-hover", enabled ? true : false)
                    ;
            })

        });
        (this.container.node() as HTMLElement).scrollTop = Number.MAX_SAFE_INTEGER;
    }

    private _onConfigTransitionClick: (e: ConfigTransitionClickEvent) => void = () => { };
    public AddOnConfigTransitionClick(callback: (e: ConfigTransitionClickEvent) => void) {
        const old = this._onConfigTransitionClick; this._onConfigTransitionClick = (...args) => { old(...args); callback(...args); };
    }

    private _onConfigShowClick: (e: ConfigShowClickEvent) => void = () => { };
    public AddOnConfigShowClick(callback: (e: ConfigShowClickEvent) => void) {
        const old = this._onConfigShowClick; this._onConfigShowClick = (...args) => { old(...args); callback(...args); };
    }

    constructor(container: d3BaseSelector) {
        super(container);

        const table = this.Selectors.table = container.append("table");

        table
            .style("font-size", "1.1em")
            .classed("table-gray", true)
            .classed("unselectable", true)
            ;

        this.AddOnConfigTransitionClick((e) => { console.debug(`Table transition clicked cfgIndex:${e.configIndex} tIndex:${e.transitionID}`); });
        this.AddOnConfigShowClick((e) => { console.debug(`Table config show clicked cfgIndex:${e.configIndex}`); });
    }
}
