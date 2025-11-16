import { channel } from './utils/channel.js'
import common from './provider-method/common.js'
import lifecycle from './provider-method/lifecycle.js'
import tradingView from './provider-method/trading-view'
import network from './provider-method/network.js'

const bridge = {
  channel,
  common,
  lifecycle,
  trading: tradingView,
  network,
}

export default bridge
