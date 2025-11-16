import { makeReceiveMessage } from '../utils/make-functions'
import { channel } from '../utils/channel'

/**
 * 网络状态变化
 * @type {(function(...[*]): void)|*}
 */
const stateChange = makeReceiveMessage(channel, 'network_state_change')

export default {
  stateChange
}
