import { Place, Arc, Transition, PNModel, netConfiguration } from "./PNModel";
import * as d3 from "d3";
import { rgb } from "d3";
import { GetArcEndpoints } from "./Helpers/ArrowEndpointCalculationHelper";
import { convertToNumberingScheme, getArrayElementMapToNumber } from "../../../CORE/Helpers/purify";
import { DrawBase, Callbacks } from "../_Basic/DrawBase";
import { d3BaseSelector, html, Position, ForceNode } from "../../../definitions/Constants";

type d3Drag = d3.DragBehavior<Element, {}, {} | d3.SubjectPosition>;
export type arc = { arc: Arc, line: { from: Position, to: Position } };

let defsIndex = 0;

/** class for drawing petri net model as graph */
export class PNDraw extends DrawBase {
  public Models = {
    net: null as PNModel,
    configuration: null as netConfiguration,
  };

  private defs =
    {
      arrowTransitionEnd: html.id.PNEditor.defs.arrowTransitionEnd + defsIndex,
      arrowPlaceEnd: html.id.PNEditor.defs.arrowPlaceEnd + defsIndex++,
    };

  public Callbacks = {
    container: new Callbacks<{}>(),
    transition: new Callbacks<Transition>(),
    arc: new Callbacks<arc>(),
    place: new Callbacks<Place>(),
  };

  private preventScroll = false;
  public scrollPreventDefault() {
    this.preventScroll = true;
  }

  public readonly simulation: d3.Simulation<{}, undefined>;

  protected Selectors = {
    places: () => this.container.select("." + html.classes.PNEditor.g.places).selectAll("g").data((this.Models.net).places),
    transitions: () => this.container.select("." + html.classes.PNEditor.g.transitions).selectAll("g").data((this.Models.net).transitions),
    arcs: () =>
      this.container.select("." + html.classes.PNEditor.g.arcs).selectAll("g")
        .data((this.Models.net).arcs.map(x => { return { arc: x, line: GetArcEndpoints(this.Models.net, x) }; })),
    arcDragLine: null as d3BaseSelector,
  };

  public _isArcDragLineVisible = false;
  public get isArcDragLineVisible() { return this._isArcDragLineVisible; }
  /**
   * Show or hides ArcDragLine
   * @param startingFrom
   */
  public ShowArcDragLine(startingFrom: Position | null) {
    const arcDragLine = this.Selectors.arcDragLine;
    const container = this.container;

    if (startingFrom == null) {
      this._isArcDragLineVisible = false;
      this.container.on("mousemove", null);

      arcDragLine
        .style("display", "none")
        .attr("x1", null)
        .attr("y1", null)
        .attr("x2", null)
        .attr("y2", null);
    } else {
      this._isArcDragLineVisible = true;

      arcDragLine
        .style("display", null)
        .attr("x1", startingFrom.x).attr("x2", startingFrom.x)
        .attr("y1", startingFrom.y).attr("y2", startingFrom.y);

      container.on("mousemove", () => {
        const pos = this.getPos();

        arcDragLine
          .attr("x2", pos.x)
          .attr("y2", pos.y);
      });
    }
  }

  private _scale: number = 1;
  public get scale(): number {
    return +this._scale;
  }

  public set scale(n: number) {
    this._scale = n;
    this.container.style("transform", `scale(${n})`);
  }


  private _showLabels: boolean = true;
  public get showLabels(): boolean {
    return this._showLabels;
  }

  public set showLabels(n: boolean) {
    this._showLabels = n;
    this.update();
  }


  constructor(container: d3BaseSelector) {
    super(container);

    this.initializeContainer();
    this.initializeContainerCallback();

    this.simulation =
      d3.forceSimulation()
        //.force("charge", d3.forceManyBody().strength(50))
        //.force("center", d3.forceCenter((this.width / 2), (this.height / 2)))
        .force("colide", d3.forceCollide().radius(25).iterations(5))
        .on("tick", () => { this.update(); })
      ;
    window.addEventListener("resize", (e) => { this.simulation.alpha(0.2); });
  }

  private initializeContainer() {

    const svg = this.container
      .classed(html.classes.common.a4, true)
      .style("transform-origin", "left top")
      .style("border", "1px lightgray solid")
      ;

    const defs = svg.append("svg:defs");
    const defsNames = html.classes.PNEditor.defs;

    const G = svg.append("g");

    G.append("g").classed(html.classes.PNEditor.g.arcs, true);
    G.append("g").classed(html.classes.PNEditor.g.places, true);
    G.append("g").classed(html.classes.PNEditor.g.transitions, true);
    this.Selectors.arcDragLine = G.append("line");


    // define arrow markers for leading arrow
    defs.append("svg:marker")
      .attr("id", this.defs.arrowTransitionEnd)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 1)
      .attr("markerWidth", 6)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M10,-5 L0,0 L10,5");

    // define arrow markers for leading arrow
    defs.append("svg:marker")
      .attr("id", this.defs.arrowPlaceEnd)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 23)
      .attr("markerWidth", 6)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

    this.Selectors.arcDragLine
      .style("stroke", "black")
      .style("stroke-width", 1.5)
      .style("display", "none")
      .style("pointer-events", "none");

    const node = (this.container.node() as HTMLElement).parentElement;

    const fnc = (e: UIEvent) => {
      if (this.preventScroll) {
        e.preventDefault();
        this.preventScroll = false;
      }
    };

    node.addEventListener("wheel", fnc, { passive: false });
  }

  protected _update(): void {
    if (!this.Models.net)
      return;

    const net = this.Models.net;
    const netConfig = this.Models.configuration;
    const netSelectors = this.Selectors;
    const callbacks = this.Callbacks;
    const getPos = this.getPos.bind(this);
    const getWheelDeltaY = this.getWheelDeltaY;

    const defsNames = html.classes.PNEditor.defs;

    const places = netSelectors.places;
    const transitions = netSelectors.transitions;
    const arcs = netSelectors.arcs;


    //#region Place

    const placesEnterGroup = places()
      .enter()
      .append("g")
      .classed(html.classes.PNEditor.place.g, true)
      ;

    callbacks.place.ConnectToElement(placesEnterGroup, getPos, getWheelDeltaY);

    const placesEnterCircle = placesEnterGroup.append("circle")
      .attr("r", 10)
      .classed(html.classes.PNEditor.place.svgCircle, true)
      ;

    const placeEnterSelect = placesEnterGroup.append("circle")
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", "1.8")
      .style("stroke-dasharray", "5")
      .attr("r", 14.5)
      .classed(html.classes.PNEditor.multiSelection.selectOutline, true)
      ;

    const placesEnterText = placesEnterGroup.append("text")
      .classed("unselectable", true)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("font-size", 10)
      .text(d => d.marking || "")
      .classed("marking", true)
      ;


    const placeEnterNameBackground = placesEnterGroup.append("text")
      .classed("text-background", true)
      .classed("unselectable", true)
      .attr("text-anchor", "middle")
      .attr("dy", "-1.3em")
      .attr("font-size", 10)
      .style("stroke-width", ".5em")
      .style("stroke", "white")
      .style("stroke-linejoin", "round")
      ;

    const placeEntrName = placesEnterGroup.append("text")
      .classed("unselectable", true)
      .attr("text-anchor", "middle")
      .attr("dy", "-1.3em")
      .attr("font-size", 10)
      .classed("idtxt", true)
      ;

    places()
      .attr("transform", (p: Place) => `translate(${p.x}, ${p.y})`)
      ;
    places()
      .select(".marking")
      .text(d => netConfig ? ((netConfig.marking.find(x => x.id === d.id) || { marking: 0 }).marking || "") : d.marking || "")
      ;

    const placeMapper = getArrayElementMapToNumber(places().data());
    places()
      .select(".idtxt")
      .text(d => convertToNumberingScheme(placeMapper(d) + 1))
      .style("display", this._showLabels ? null : "none")
      ;
    places()
      .select(".text-background")
      .text(d => convertToNumberingScheme(placeMapper(d) + 1))
      .style("display", this._showLabels ? null : "none")
      ;

    //#endregion


    //#region Transitions

    const transitionEnterGroup = transitions().enter()
      .append("g")
      .classed(html.classes.PNEditor.transition.g, true)
      ;

    callbacks.transition.ConnectToElement(transitionEnterGroup, getPos, getWheelDeltaY)
      ;

    const transitionEnterRect =
      transitionEnterGroup
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", -10)
        .attr("y", -10)
      ;


    const transitionEnterEpsilon = transitionEnterGroup.append("text")
      .classed(html.classes.PNEditor.transition.epsilon, true)
      .style("fill", "white")
      .style("user-select", "none")
      .text("ε")
      ;

    const transitionEnterNameBackground = transitionEnterGroup.append("text")
      .classed("text-background", true)
      .classed("unselectable", true)
      .attr("text-anchor", "middle")
      .attr("dy", "-1.3em")
      .attr("font-size", 10)
      .style("stroke-width", ".5em")
      .style("stroke", "white")
      .style("stroke-linejoin", "round")
      ;

    const transitionEnterName = transitionEnterGroup.append("text")
      .classed("unselectable", true)
      .attr("text-anchor", "middle")
      .attr("dy", "-1.3em")
      .attr("font-size", 10)
      .classed("idtxt", true)
      ;

    transitions()
      .attr("transform", (t: Transition) => `translate(${t.x}, ${t.y})`)
      ;
    transitions()
      .select("." + html.classes.PNEditor.transition.epsilon)
      .style("display", d => d.isCold ? null : "none")
      ;
    transitions()
      .select("rect")
      .style("fill", t => (netConfig ? netConfig.enabledTransitionsIDs.findIndex(x => x === t.id) >= 0 : net.IsTransitionEnabled(t)) ? rgb(0, 128, 0).hex() : rgb(0, 0, 0).hex())
      ;

    const transitionMapper = getArrayElementMapToNumber(transitions().data());
    transitions()
      .select(".idtxt")
      .text(d => (transitionMapper(d) + 1))
      .style("display", this._showLabels ? null : "none")
      ;
    transitions()
      .select(".text-background")
      .text(d => (transitionMapper(d) + 1))
      .style("display", this._showLabels ? null : "none")
      ;

    //#endregion


    //#region Arc

    const enterArc =
      arcs()
        .enter()
        .append("g");
    enterArc
      .append("line")
      .classed(html.classes.PNEditor.helper.arcVisibleLine, true)
      .style("stroke", "black")
      .style("stroke-width", 1.5);

    const enterArcHitboxLine = enterArc
      .append("line")
      .classed(html.classes.PNEditor.helper.arcHitboxLine, true)
      .style("stroke", "black")
      .attr("opacity", "0")
      .style("stroke-width", 15)
      ;
    callbacks.arc.ConnectToElement(enterArcHitboxLine, getPos, getWheelDeltaY);

    enterArc.append("text")
      .classed("text-background", true)
      .classed("unselectable", true)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("font-size", 10)
      .style("stroke-width", ".3em")
      .style("stroke", "white")
      .style("stroke-linejoin", "round")
      ;

    const enterArcText = enterArc.append("text")
      .classed("text-foreground", true)
      .classed("unselectable", true)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("font-size", 10)
      ;

    callbacks.arc.ConnectToElement(enterArcText, getPos, getWheelDeltaY);

    arcs().select(`.${html.classes.PNEditor.helper.arcVisibleLine}`)
      .style("marker-end", a => a.arc.toPlace > 0 ? `url(#${this.defs.arrowPlaceEnd})` : "")
      .style("marker-start", a => a.arc.toTransition > 0 ? `url(#${this.defs.arrowTransitionEnd})` : "")
      .attr("x1", a => a.line.from.x)
      .attr("y1", a => a.line.from.y)
      .attr("x2", a => a.line.to.x)
      .attr("y2", a => a.line.to.y);

    arcs().select(`.${html.classes.PNEditor.helper.arcHitboxLine}`)
      .attr("x1", a => a.line.from.x)
      .attr("y1", a => a.line.from.y)
      .attr("x2", a => a.line.to.x)
      .attr("y2", a => a.line.to.y);

    arcs().select(".text-foreground")
      .attr("x", a => Math.abs(a.line.to.x - a.line.from.x) / 2 + Math.min(a.line.to.x, a.line.from.x) - 5)
      .attr("y", a => Math.abs(a.line.to.y - a.line.from.y) / 2 + Math.min(a.line.to.y, a.line.from.y) - 5)
      .text(d => {
        let toPlace: number | string = Math.abs(d.arc.toPlace);
        let toTransition: number | string = Math.abs(d.arc.toTransition);

        toPlace = isNaN(toPlace) || toPlace === 0 ? "" : toPlace;
        toTransition = isNaN(toTransition) || toTransition === 0 ? "" : toTransition;

        return (toPlace + "°" + toTransition) || "";
      });

    arcs().select(".text-background")
      .attr("x", a => Math.abs(a.line.to.x - a.line.from.x) / 2 + Math.min(a.line.to.x, a.line.from.x) - 5)
      .attr("y", a => Math.abs(a.line.to.y - a.line.from.y) / 2 + Math.min(a.line.to.y, a.line.from.y) - 5)
      .text(d => {
        let toPlace: number | string = Math.abs(d.arc.toPlace);
        let toTransition: number | string = Math.abs(d.arc.toTransition);

        toPlace = isNaN(toPlace) || toPlace === 0 ? "" : toPlace;
        toTransition = isNaN(toTransition) || toTransition === 0 ? "" : toTransition;

        return (toPlace + "°" + toTransition) || "";
      });

    //#endregion


    netSelectors.places().classed(html.classes.PNEditor.multiSelection.selected, false);
    netSelectors.transitions().classed(html.classes.PNEditor.multiSelection.selected, false);

    const selected = net.selected;
    if (selected) {
      netSelectors.places()
        .classed("selected", elm => (selected.places as any).includes(elm));
      netSelectors.transitions()
        .classed("selected", elm => (selected.tranisitons as any).includes(elm));
    } else {
      netSelectors.places().classed("selected", false);
      netSelectors.transitions().classed("selected", false);
    }

    arcs().exit().remove();
    places().exit().remove();
    transitions().exit().remove();

    const simulationNodes = [...places().data(), ...transitions().data()];
    this.simulation.nodes(simulationNodes);

    const margin = 25;

    const width = this.width;
    const height = this.height;
    if (width > 10 && height > 10)
      this.simulation.nodes().forEach(((d) => {
        //if (d.fx != null) d.fx = Math.max(margin, Math.min(width - margin, d.fx))
        //if (d.fy != null) d.fy = Math.max(margin, Math.min(height - margin, d.fy))

        d.x = Math.max(margin, Math.min(width - margin, d.x));
        d.y = Math.max(margin, Math.min(height - margin, d.y));
      }) as (d: ForceNode) => void);
  }
}