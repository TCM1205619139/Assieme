import Shape from './Shape'
import { CanvasStyle, PRIMARY_CANVAS_STYLE } from './style'

export default class Rect extends Shape {
  dx: number
  dy: number
  width: number
  height: number
  style: CanvasStyle = {
    ...PRIMARY_CANVAS_STYLE,
    fillStyle: 'transparent',
    strokeStyle: 'transparent'
  }

  constructor (x: number, y: number, width: number, height: number) {
    super(0, 0)
    this.dx = x
    this.dy = y
    this.width = width
    this.height = height
    this.updateBoundingRect()
  }

  draw () {
    if (!this.ctx) return
    this.ctx.beginPath()
    this.initDrawStyle()
    this.ctx.rect(
      this.boundingRect.x,
      this.boundingRect.y,
      this.boundingRect.width,
      this.boundingRect.height
    )
    this.ctx.stroke()
    this.ctx.fill()
  }

  updateBoundingRect (): void {
    this.boundingRect = {
      width: this.width,
      height: this.height,
      x: this.offset.x + this.dx,
      y: this.offset.y + this.dy,
      left: this.offset.x + this.dx,
      right: this.offset.x + this.dx + this.width,
      top: this.offset.y + this.dy,
      bottom: this.offset.y + this.dy + this.height
    }
  }
}
