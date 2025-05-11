import Shape from './Shape'
import { CanvasStyle, PRIMARY_CANVAS_STYLE } from './style'

export default class Text extends Shape {
  private sx: number
  private sy: number
  private content: string
  style: CanvasStyle = {
    ...PRIMARY_CANVAS_STYLE,
    fillStyle: '#000'
  }

  constructor (x: number, y: number, content: string) {
    super(0, 0)
    this.sx = x
    this.sy = y
    this.content = content
    this.updateBoundingRect()
  }

  draw (): void {
    if (!this.ctx) return
    this.ctx.beginPath()
    this.initDrawStyle()
    this.ctx.fillText(
      this.content,
      this.offset.x + this.sx,
      this.offset.y + this.sy
    )
  }

  updateBoundingRect (): void {
    this.boundingRect = {
      width: 0,
      height: 0,
      x: this.sx + this.offset.x,
      y: this.sy + this.offset.y,
      left: this.sx + this.offset.x,
      right: this.sx + this.offset.x,
      top: this.sy + this.offset.y,
      bottom: this.sy + this.offset.y
    }
  }
}
