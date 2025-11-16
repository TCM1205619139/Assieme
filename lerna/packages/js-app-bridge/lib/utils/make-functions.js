import { v4 as uuidv4 } from 'uuid'
/**
 * 通过闭包函数进行柯里化
 * @param eventType {string} 事件名称
 * @returns {function(...[*]): *}
 */
const id = uuidv4()
export const makePostMessage = (eventType) => {
  if (!window.flutter_inappwebview) {
    // 未处于 flutter 环境中，如果在开发阶段可以进行特殊处理
    return (...args) => {
      console.info(`发送 消息： `, eventType, ...args, id)
    };
  }

  return (...args) => {
    const stringifyArgs = args.map(arg => JSON.stringify(arg))
    console.info(`发送 消息： `, eventType, ...args)
    return window.flutter_inappwebview.callHandler('postMessage', eventType, ...stringifyArgs, JSON.stringify(id))
  }
}

export const makeReceiveMessage = (channel, message) => {
  return (...args) => {
    const typeArgs = args.map(arg => JSON.parse(arg))
    console.info('收到app的事件-解析之后', message, typeArgs);

    channel.emit(message, ...typeArgs)
  }
}
