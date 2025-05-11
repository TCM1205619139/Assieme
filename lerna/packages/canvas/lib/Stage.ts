import Shape, { Offset, BoundingClientRect } from './Shape'
import { emitter, EventCallBackFunction, ShapeEventWrapper } from './CanvasEvent'

export default class Stage {
  readonly canvas: HTMLCanvasElement | null = null
  readonly ctx: CanvasRenderingContext2D | null = null
  readonly emitter = emitter

  private canvasEvents: Record<string, EventCallBackFunction[]> = {}
  private shapeEvents: Record<string, ShapeEventWrapper[]> = {}

  private offset: Offset = {
    x: 0,
    y: 0
  }

  visibleViewRect: BoundingClientRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  drawableViewRect: BoundingClientRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  shapes: Shape[] = []
  drawableShapes: Shape[] = []
  visibleShapes: Shape[] = []

  constructor (id: string | HTMLCanvasElement) {
    let canvas
    if (typeof id === 'string') {
      canvas = document.getElementById(id)
    } else {
      canvas = id
    }
    if (canvas instanceof HTMLCanvasElement) {
      this.canvas = canvas
      this.ctx = this.canvas.getContext('2d')
      this.calcDrawableViewRect()
      this.calcVisibleViewRect()
    } else {
      throw new Error('无效的canvas元素或canvas元素id')
    }
  }

  addOffset (x: number, y: number) {
    if (!this.ctx) return
    this.offset = {
      x: this.offset.x + x,
      y: this.offset.y + y
    }
    this.ctx.setTransform(1, 0, 0, 1, this.offset.x, this.offset.y)
    this.drawableShapes = this.calcDrawableShapes(this.shapes)
    this.visibleShapes = this.calcVisibleShapes(this.shapes)
    this.draw()
  }

  addShape (shape: Shape) {
    shape.relate(this)
    this.shapes.push(shape)
    this.drawableShapes.push(...this.calcDrawableShapes([shape]))
  }

  addShapeEvents (events: ShapeEventWrapper[]) {
    events.forEach(event => {
      if (!this.canvas) return
      const { cb, type, shape } = event

      if (!this.shapeEvents[type]) {
        this.shapeEvents[type] = []
      }

      if (!this.canvasEvents[type]) {
        this.canvasEvents[type] = []

        const listener = (evt: Event) => {
          const { type: eventType } = evt
          const events = this.shapeEvents[eventType].filter(item => {
            const { shape } = item

            return this.visibleShapes.findIndex(vs => {
              return vs.getId() === shape.getId()
            }) !== -1
          })
          console.log(events)
        }

        this.canvas.addEventListener(type, listener)
      }
      this.shapeEvents[type].push(event)
    })
  }

  private calcDrawableViewRect () {
    if (!this.canvas) return
    this.drawableViewRect = {
      left: -this.offset.x - 0.5 * this.canvas.width,
      top: -this.offset.y - 0.5 * this.canvas.height,
      right: -this.offset.x + this.canvas.width * 1.5,
      bottom: -this.offset.y + this.canvas.height * 1.5,
      x: -this.offset.x - 0.5 * this.canvas.width,
      y: -this.offset.y - 0.5 * this.canvas.height,
      width: this.canvas.width * 2,
      height: this.canvas.height * 2
    }
  }

  private calcVisibleViewRect () {
    if (!this.canvas) return
    this.visibleViewRect = {
      left: -this.offset.x,
      top: -this.offset.y,
      right: -this.offset.x + this.canvas.width,
      bottom: -this.offset.y + this.canvas.height,
      x: -this.offset.x,
      y: -this.offset.y,
      width: this.canvas.width,
      height: this.canvas.height
    }
  }

  calcDrawableShapes (shapes: Shape[]) {
    if (!this.canvas) return []
    this.calcDrawableViewRect()
    return shapes.filter(shape => {
      const { left, right, top, bottom } = shape.getBoundingRect()
      if (
        right < this.drawableViewRect.left ||
        left > this.drawableViewRect.right ||
        top > this.drawableViewRect.bottom ||
        bottom < this.drawableViewRect.top
      ) {
        return false
      }
      return true
    })
  }

  calcVisibleShapes (shapes: Shape[]) {
    if (!this.canvas) return []
    this.calcVisibleViewRect()
    return shapes.filter(shape => {
      const { left, right, top, bottom } = shape.getBoundingRect()
      if (
        right < this.visibleViewRect.left ||
        left > this.visibleViewRect.right ||
        top > this.visibleViewRect.bottom ||
        bottom < this.visibleViewRect.top
      ) {
        return false
      }
      return true
    })
  }

  draw () {
    if (!this.ctx) return
    this.ctx.clearRect(
      this.drawableViewRect.x,
      this.drawableViewRect.y,
      this.drawableViewRect.width,
      this.drawableViewRect.height
    )
    this.drawableShapes = this.calcDrawableShapes(this.shapes)
    this.drawableShapes.forEach(shape => {
      shape.draw()
    })
  }

  getOffset () {
    return this.offset
  }

  removeAllShapes () {
    if (!this.ctx) return
    this.shapes = []
    this.drawableShapes = []
    this.removeAllShapeEvents()
    this.ctx.clearRect(
      this.drawableViewRect.x,
      this.drawableViewRect.y,
      this.drawableViewRect.width,
      this.drawableViewRect.height
    )
  }

  removeAllShapeEvents () {
    if (!this.canvas) return
    for (const type in this.canvasEvents) {
      this.canvasEvents[type].forEach((event) => {
        this.canvas?.removeEventListener(type, event)
      })
    }
    this.shapeEvents = {}
  }

  setOffset (x: number, y: number) {
    if (!this.ctx) return
    this.offset = {
      x,
      y
    }
    this.ctx.setTransform(1, 0, 0, 1, this.offset.x, this.offset.y)
    this.drawableShapes = this.calcDrawableShapes(this.shapes)
    this.visibleShapes = this.calcVisibleShapes(this.shapes)
    this.draw()
  }
}
