import { v4 as uuidv4 } from 'uuid'
import { PRIMARY_CANVAS_STYLE, CanvasStyle } from './style'
import Stage from './Stage'
import { EventCallBackFunction, ShapeEventWrapper } from './CanvasEvent'

export type Offset = {
  x: number,
  y: number
}
type CanvasStyleKeys = keyof CanvasStyle

export type BoundingClientRect = {
  x: number,
  y: number,
  width: number,
  height: number,
  top: number,
  right: number,
  bottom: number,
  left: number
}

export default abstract class Shape {
  private readonly id: string = ''
  // protected events: Record<string, EventCallBackFunction[]> = {}
  protected events: ShapeEventWrapper[] = []
  protected canvas: HTMLCanvasElement | null = null
  protected ctx: CanvasRenderingContext2D | null = null
  protected stage: Stage | null = null
  protected style: CanvasStyle = {
    ...PRIMARY_CANVAS_STYLE
  }

  protected offset: Offset = {
    x: 0,
    y: 0
  }

  protected boundingRect: BoundingClientRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  constructor (x: number, y: number) {
    this.id = uuidv4()
    this.offset = {
      x,
      y
    }
  }

  abstract draw (): void

  abstract updateBoundingRect (): void

  addEventListener (type: string, cb: EventCallBackFunction) {
    this.events.push({
      type,
      cb,
      shape: this
    })
  }

  getBoundingRect () {
    return this.boundingRect
  }

  getEvents () {
    return this.events
  }

  getId () {
    return this.id
  }

  getOffset () {
    return this.offset
  }

  initDrawStyle () {
    if (this.ctx === null) return
    const keys = Object.keys(this.style) as CanvasStyleKeys[]
    const length = keys.length
    const ctx: any = this.ctx
    for (let i = 0; i < length; i++) {
      const key = keys[i]
      ctx[key] = this.style[key]
    }
  }

  relate (stage: Stage) {
    this.stage = stage
    this.canvas = stage.canvas
    this.ctx = stage.ctx
    this.events.forEach(event => {
      // console.log(event)
    })
    this.stage.addShapeEvents(this.events)
  }

  setOffset (x: number, y: number) {
    this.offset = {
      x,
      y
    }
    this.updateBoundingRect()
  }

  addOffset (x: number, y: number) {
    this.offset = {
      x: x + this.offset.x,
      y: y + this.offset.y
    }
    this.updateBoundingRect()
  }

  setStyle (style: Partial<CanvasStyle>): void {
    this.style = Object.assign(this.style, style)
  }
}
