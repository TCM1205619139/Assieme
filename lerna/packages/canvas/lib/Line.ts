import Shape from './Shape'
import { CanvasStyle, PRIMARY_CANVAS_STYLE } from './style'

export default class Line extends Shape {
  sx: number
  sy: number
  dx: number
  dy: number
  style: CanvasStyle = {
    ...PRIMARY_CANVAS_STYLE,
    strokeStyle: '#000'
  }

  constructor (sx: number, sy: number, dx: number, dy: number) {
    super(0, 0)
    this.sx = sx
    this.sy = sy
    this.dx = dx
    this.dy = dy
    this.updateBoundingRect()
  }

  draw (): void {
    if (!this.ctx) return
    this.ctx.beginPath()
    this.initDrawStyle()
    this.ctx.moveTo(this.boundingRect.left, this.boundingRect.top)
    this.ctx.lineTo(this.boundingRect.right, this.boundingRect.bottom)
    this.ctx.stroke()
  }

  updateBoundingRect (): void {
    this.boundingRect = {
      width: Math.abs(this.dx - this.sx),
      height: Math.abs(this.dy - this.sy),
      x: Math.min(this.dx, this.sx) + this.offset.x,
      y: Math.max(this.dy, this.sy) + this.offset.y,
      left: Math.min(this.dx, this.sx) + this.offset.x,
      right: Math.max(this.dx, this.sx) + this.offset.x,
      top: Math.min(this.dy, this.sy) + this.offset.y,
      bottom: Math.max(this.dy, this.sy) + this.offset.y
    }
  }
}
