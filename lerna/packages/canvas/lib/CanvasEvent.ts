import Shape from './Shape'

const { EventEmitter } = require('events')

class CanvasShapeEvent extends EventEmitter {
  private static emitter: CanvasShapeEvent | null = null

  private constructor (...args: any[]) {
    super(...args)
  }

  static createInstance () {
    if (!CanvasShapeEvent.emitter) {
      CanvasShapeEvent.emitter = new CanvasShapeEvent()
    }
    return CanvasShapeEvent.emitter
  }
}

const emitter = CanvasShapeEvent.createInstance()

type EventCallBackFunction = (e: Event) => void
type ShapeEventWrapper = {
  shape: Shape, // Shape
  type: string,
  cb: EventCallBackFunction
}

class EventManager {
  private dom: HTMLElement
  private domEvents: ShapeEventWrapper[] = []

  constructor (dom: HTMLCanvasElement) {
    this.dom = dom
  }
}

export {
  emitter,
  EventCallBackFunction,
  ShapeEventWrapper
}
