﻿import { d3BaseSelector, Position } from "../../../Constants";
import { typedNull } from "../../../../Helpers/purify";
import * as d3 from "d3";
import { Key } from "ts-keycode-enum";

export class PNDrawInputs {
    private readonly svgGContainer: d3BaseSelector;
    private Selectors = {
        foreign: typedNull<d3BaseSelector>(),
        marking: {
            div: typedNull<d3BaseSelector>(),
            input: typedNull<d3BaseSelector>(),
            buttonOK: typedNull<d3BaseSelector>(),
        },
        arcValue: {
            div: typedNull<d3BaseSelector>(),
            inputs: {
                toPlace: typedNull<d3BaseSelector>(),
                toTransition: typedNull<d3BaseSelector>(),
            },
            buttonOK: typedNull<d3BaseSelector>(),
        },
    };

    private MoveForeign(pos: Position | null) {
        const foreign = this.Selectors.foreign;
        if (pos == null) {
            this.Selectors.foreign.style("display", "none");
            foreign
                .attr("x", null)
                .attr("y", null);
        } else {
            this.Selectors.foreign.style("display", null);
            foreign
                .attr("x", pos.x)
                .attr("y", pos.y);
        }
    }

    public HideAllInputs() {
        this.MoveForeign(null);
        this.Selectors.marking.div.style("display", "none");
        this.Selectors.arcValue.div.style("display", "none");
    }

    public ShowInputMarking(pos: Position, initialState: number = null) {
        this.HideAllInputs();
        this.MoveForeign(pos);

        this.Selectors.marking.div.style("display", null);
        const input = this.Selectors.marking.input;

        (input.node() as any).value = initialState || null;
        (input.node() as any).focus();
    }

    public ShowInputArc(pos: Position, initialState: { toPlace: number, toTransition: number } = null) {
        this.HideAllInputs();
        this.MoveForeign(pos);

        this.Selectors.arcValue.div.style("display", null);
        const inputs = this.Selectors.arcValue.inputs;

        (inputs.toPlace.node() as any).value = initialState == null ? 0 : initialState.toPlace;
        (inputs.toTransition.node() as any).value = initialState == null ? 0 : initialState.toTransition;

        (inputs.toPlace.node() as any).focus();
    }

    private _onInputMarking = (input: number | null) => { }
    public AddOnInputMarking(callback: (intput: number | null) => void) {
        const old = this._onInputMarking;
        this._onInputMarking = (...args) => { old(...args); callback(...args); }
    }

    private _onInputArc = (input: { toPlace: number, toTransition: number } | null) => { }
    public AddOnInputArc(callback: (intput: { toPlace: number, toTransition: number } | null) => void) {
        const old = this._onInputArc;
        this._onInputArc = (...args) => { old(...args); callback(...args); }
    }


    constructor(svgGContainer: d3BaseSelector) {
        this.svgGContainer = svgGContainer;

        const foreign = this.Selectors.foreign = svgGContainer.append("foreignObject")
            .style("display", "none")
            .attr("width", "100%");

        //foreign.on("click", () => { d3.event.stopPropagation(); });

        const markingDiv = this.Selectors.marking.div = foreign.append("xhtml:div")
            .style("height", "50")
            .style("width", "fit-content")
            .style("background", "white")
            .style("display", "none");

        const markingInput = this.Selectors.marking.input = markingDiv.append("xhtml:input")
            .attr("type", "number")
            .attr("min", 0)
            .attr("max", 999)
            .style("width", "50px")
            .style("height", "24px")

        const markingButtonOk = this.Selectors.marking.buttonOK = markingDiv.append("xhtml:input")
            .attr("type", "button")
            .attr("value", "OK")
            .style("width", "35px");

        const EndMarkingInput = (save: boolean) => {
            if (save) {
                const value = +(markingInput.node() as any).value;
                this._onInputMarking(value);
            } else {
                this._onInputMarking(null);
            }
            this.HideAllInputs();
        }

        markingButtonOk.on("click", () => {
            EndMarkingInput(true);
            d3.event.stopPropagation();
        })

        markingInput.on("keypress", () => {
            if (d3.event.keyCode == Key.Enter) {
                EndMarkingInput(true);
            } else if (d3.event.keyCode == Key.Escape) {
                EndMarkingInput(false);
            }
            d3.event.stopPropagation();
        });


        const arcDiv = this.Selectors.arcValue.div = foreign.append("xhtml:div")
            .style("height", "50")
            .style("width", "fit-content")
            .style("background", "white")
            .style("display", "none");

        const arcInputToPlace = this.Selectors.arcValue.inputs.toPlace = arcDiv.append("xhtml:input")
            .attr("type", "number")
            .attr("min", -999)
            .attr("max", 999)
            .style("width", "50px")
            .style("height", "24px")

        arcDiv.append("span").text("°");

        const arcInputToTranisiton = this.Selectors.arcValue.inputs.toTransition = arcDiv.append("xhtml:input")
            .attr("type", "number")
            .attr("min", 0)
            .attr("max", 999)
            .style("width", "50px")
            .style("height", "24px")


        const arcButtonOk = this.Selectors.arcValue.buttonOK = arcDiv.append("xhtml:input")
            .attr("type", "button")
            .attr("value", "OK")
            .style("width", "35px")

        const EndArcInput = (save: boolean) => {
            if (save) {
                const toPlace = +(arcInputToPlace.node() as any).value;
                const toTransition = +(arcInputToTranisiton.node() as any).value;
                this._onInputArc({ toPlace, toTransition });
            } else {
                this._onInputArc(null);
            }
            this.HideAllInputs();
        }

        arcButtonOk.on("click", () => {
            EndArcInput(true);
            d3.event.stopPropagation();
        })

        const arcInputOnKeypress = () => {
            if (d3.event.keyCode == Key.Enter) {
                EndArcInput(true);
                d3.event.stopPropagation();
            } else if (d3.event.keyCode == Key.Escape) {
                EndArcInput(false);
                d3.event.stopPropagation();
            }
        }

                
        arcDiv.on("click", () => { d3.event.stopPropagation(); })
        markingDiv.on("click", () => { d3.event.stopPropagation(); })

        arcInputToPlace.on("keypress", arcInputOnKeypress);
        arcInputToTranisiton.on("keypress", arcInputOnKeypress);
    }
}

