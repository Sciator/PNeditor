import * as d3 from "d3";
import { Selection } from "d3";
import { d3BaseSelector, Position } from "../../../definitions/Constants";
import { ModelBase } from "./ModelBase";

type d3Drag = d3.DragBehavior<Element, {}, {} | d3.SubjectPosition>;

type selectors = { [key: string]: d3BaseSelector | (() => d3BaseSelector) | selectors };
type models = { [key: string]: {} | ModelBase<any> | (() => ModelBase<any>) | models };

/** Base abstract class for handling visualisation of models. */
export abstract class DrawBase {
  public readonly container: d3BaseSelector;

  public abstract get Callbacks(): { container: Callbacks<{}>, [key: string]: Callbacks<any> };

  public abstract get Models(): models;

  protected abstract get Selectors(): selectors;

  public get width() { return (this.container.node() as HTMLElement).getBoundingClientRect().width; }
  public get height() { return (this.container.node() as HTMLElement).getBoundingClientRect().height; }

  private updating = false;
  /** schedule redraw function for next animation frame */
  public update() {
    if (this.updating)
      return;
    this.updating = true;
    requestAnimationFrame((() => {
      try {
        this._update();
      } finally {
        this.updating = false;
      }
    }).bind(this));
  }

  /** Get mouse position relative to current container element */
  protected getPos(): Position {
    const coords = d3.mouse(this.container.node() as SVGSVGElement);
    const pos = { x: coords[0], y: coords[1] };
    return pos;
  }

  /** returns wheel delta y */
  protected getWheelDeltaY(): number {
    const e = d3.event;
    const deltaY = e.deltaY;
    return deltaY;
  }

  /** redraws svg elements - called on rAF */
  protected abstract _update(): void;

  /** connects svg callbacks */
  protected initializeContainerCallback() {
    const getPos = this.getPos.bind(this);
    const getWheelDeltaY = this.getWheelDeltaY;

    this.Callbacks.container.ConnectToElement(this.container, getPos, getWheelDeltaY);
  }

  constructor(container: d3BaseSelector) {
    this.container = container;
  }
}

export enum CallbackType { "letfClick", "rightClick", "wheel", "dragStart", "drag", "dragEnd", "dragRevert" }
/** class for holding mouse callbacks for drawmodels */
export class Callbacks<type> {
  static readonly distanceDeadzone = 8;

  public AddCallback(callbackType: CallbackType.wheel, callback: (obj: type, wheelDeltaY: number) => void): void;
  public AddCallback(callbackType: CallbackType.letfClick, callback: (obj: type, pos: Position) => void): void;
  public AddCallback(callbackType: CallbackType.rightClick, callback: (obj: type, pos: Position) => void): void;
  public AddCallback(callbackType: CallbackType.dragStart | CallbackType.drag | CallbackType.dragEnd | CallbackType.dragRevert, callback: (obj: type, pos: Position, startPos?: Position) => void): void;
  public AddCallback(callbackType: CallbackType, callback: any) {
    let old: any;
    switch (callbackType) {
      case CallbackType.letfClick:
        old = this.onClick; this.onClick = (...args) => { old(...args); callback(...args); };
        break;
      case CallbackType.rightClick:
        old = this.onContextMenu; this.onContextMenu = (...args) => { old(...args); callback(...args); };
        break;
      case CallbackType.wheel:
        old = this.onWheel; this.onWheel = (...args) => { old(...args); callback(...args); };
        break;
      case CallbackType.dragStart:
        old = this.onDragStart; this.onDragStart = (...args) => { old(...args); callback(...args); };
        break;
      case CallbackType.drag:
        old = this.onDragDrag; this.onDragDrag = (...args) => { old(...args); callback(...args); };
        break;
      case CallbackType.dragEnd:
        old = this.onDragEnd; this.onDragEnd = (...args) => { old(...args); callback(...args); };
        break;
      case CallbackType.dragRevert:
        old = this.onDragDeadzoneRevert; this.onDragDeadzoneRevert = (...args) => { old(...args); callback(...args); };
        break;
      default:
    }
  }

  public onClick = (_obj: type, pos: Position) => { };
  public onContextMenu = (_obj: type, pos: Position) => { };
  public onWheel = (_obj: type, wheelDeltaY: number) => { };

  private onDragStart = (_obj: type, _position: Position, _startPosition: Position) => { };
  private onDragDrag = (_obj: type, _position: Position, _startPosition: Position) => { };
  private onDragEnd = (_obj: type, _position: Position, _startPosition: Position) => { };
  private onDragDeadzoneRevert = (_obj: type, _position: Position, _startPosition: Position) => { };

  public ConnectToElement(element: Selection<d3.BaseType, type, d3.BaseType, {}>, mousePosGetter: () => Position, wheelDeltaGetter: () => number) {
    this.DragOverridePositionFunction = mousePosGetter;
    element
      .on("click", (elm) => { this.onClick(elm, mousePosGetter()); })
      .on("contextmenu", (elm) => { this.onContextMenu(elm, mousePosGetter()); })
      .on("wheel", (elm) => { this.onWheel(elm, wheelDeltaGetter()); }, true);
    (element as any).call(this.onDrag);
  }

  public DragOverridePositionFunction: () => Position = null;

  private positionStartDrag: Position;
  public onDrag: d3Drag = d3.drag()
    .clickDistance(Callbacks.distanceDeadzone)
    .on("start", (obj: type) => {
      let pos = null;
      if (this.DragOverridePositionFunction) {
        const { x, y } = this.DragOverridePositionFunction();
        pos = { x, y };

      } else {
        const { x, y } = (d3.event as Position);
        pos = { x, y };
      }
      this.positionStartDrag = pos;
      this.onDragStart(obj, pos, { ...this.positionStartDrag });
    })
    .on("drag", (obj: type) => {
      let pos = null;
      if (this.DragOverridePositionFunction) {
        const { x, y } = this.DragOverridePositionFunction();
        pos = { x, y };

      } else {
        const { x, y } = (d3.event as Position);
        pos = { x, y };
      }

      this.onDragDrag(obj, pos, { ...this.positionStartDrag });
    })
    .on("end", (obj: type) => {
      let pos = null;
      if (this.DragOverridePositionFunction) {
        const { x, y } = this.DragOverridePositionFunction();
        pos = { x, y };

      } else {
        const { x, y } = (d3.event as Position);
        pos = { x, y };
      }

      const dx = pos.x - this.positionStartDrag.x;
      const dy = pos.y - this.positionStartDrag.y;
      const successfull = (dx * dx + dy * dy > Callbacks.distanceDeadzone * Callbacks.distanceDeadzone);
      if (successfull)
        this.onDragEnd(obj, pos, { ...this.positionStartDrag });
      else
        this.onDragDeadzoneRevert(obj, pos, { ...this.positionStartDrag });

      this.positionStartDrag = null;
    });
}
