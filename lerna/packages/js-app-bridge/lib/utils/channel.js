import EventEmitter from 'eventemitter3'

class Channel {
  static instance = null
  emitter = null

  constructor() {
    this.emitter = new EventEmitter()
  }

  static getInstance () {
    if (!Channel.instance) {
      Channel.instance = new Channel()
    }

    return Channel.instance
  }

  /**
   * 利用 eventemitter3 进行事件派发
   * @param event
   * @param args
   */
  emit (event, ...args) {
    if (!this.emitter) {
      throw new Error('Channel.instance is not inited')
    }
    this.emitter.emit(event, ...args)
  }

  on(event, fn) {
    if (!this.emitter) {
      throw new Error('Channel.instance is not inited')
    }

    this.emitter.on(event, fn)
  }

  off (event, fn) {
    if (!this.emitter) {
      throw new Error('Channel.instance is not inited')
    }
    this.emitter.off(event, fn)
  }
}

const channel = Channel.getInstance()

export default Channel

export {
  channel
}
