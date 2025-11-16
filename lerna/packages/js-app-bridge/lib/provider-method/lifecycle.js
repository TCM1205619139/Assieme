import { makeReceiveMessage } from '../utils/make-functions'
import { channel } from '../utils/channel'

/**
 * 当 App 由后台唤起重新回到前台
 * @type {(function(...[*]): void)|*}
 */
const onApplicationActivated = makeReceiveMessage(channel, 'on_application_activated')

/**
 * 当 App 由前台进度后台状态
 * @type {(function(...[*]): void)|*}
 */
const onApplicationDeactivated = makeReceiveMessage(channel, 'on_application_deactivated')

export default {
  onApplicationDeactivated,
  onApplicationActivated
}
