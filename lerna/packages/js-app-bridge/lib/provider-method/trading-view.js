import { makeReceiveMessage } from '../utils/make-functions'
import { channel } from '../utils/channel'

const setTradingViewChartType = makeReceiveMessage(channel, 'set_trading_view_chart_type')
const injectTradingViewChartConfig = makeReceiveMessage(channel, 'inject_trading_view_config')
const setTradingViewResolution = makeReceiveMessage(channel, 'set_trading_view_resolution')
const setTradingViewVisableRange = makeReceiveMessage(channel, 'set_trading_view_visable_range')
const setTradingViewIndicator = makeReceiveMessage(channel, 'set_trading_view_indicator')
const startTradingViewDrawHorizontalLine = makeReceiveMessage(channel, 'start_trading_view_draw_horizontal_line')
const startTradingViewDrawVerticalLine = makeReceiveMessage(channel, 'start_trading_view_draw_vertical_line')
const startTradingViewDrawTrendLine = makeReceiveMessage(channel, 'start_trading_view_draw_trend_line')
const startTradingViewDrawTrendAngle = makeReceiveMessage(channel, 'start_trading_view_draw_trend_angle')
const startTradingViewDrawArrow = makeReceiveMessage(channel, 'start_trading_view_draw_arrow')
const startTradingViewDrawParallelChannel = makeReceiveMessage(channel, 'start_trading_view_draw_parallel_channel')
const showTradingViewDrawAllShape = makeReceiveMessage(channel, 'show_trading_view_draw_all_shape')
const showTradingViewAllIndicator = makeReceiveMessage(channel, 'show_trading_view_all_indicator')
const hideTradingViewDrawAllShape = makeReceiveMessage(channel, 'hide_trading_view_draw_all_shape')
const hideTradingViewAllIndicator = makeReceiveMessage(channel, 'hide_trading_view_all_indicator')
const removeTradingViewAllShape = makeReceiveMessage(channel, 'remove_trading_view_all_shape')
const removeTradingViewAllIndicator = makeReceiveMessage(channel, 'remove_trading_view_all_indicator')
const removeTradingViewAllShapeAndIndicator = makeReceiveMessage(channel, 'remove_trading_view_all_shape_and_indicator')
const clearTradingViewIndexDb = makeReceiveMessage(channel, 'clear_trading_view_index_db')
const switchTradingViewMaskWrapper = makeReceiveMessage(channel, 'switch_trading_view_mask_wrapper')
const tradingViewKeepAlive = makeReceiveMessage(channel, 'trading_view_keep_alive')

export default {
  setTradingViewChartType,
  injectTradingViewChartConfig,
  setTradingViewResolution,
  setTradingViewVisableRange,
  setTradingViewIndicator,
  startTradingViewDrawHorizontalLine,
  startTradingViewDrawVerticalLine,
  startTradingViewDrawTrendLine,
  startTradingViewDrawTrendAngle,
  startTradingViewDrawArrow,
  startTradingViewDrawParallelChannel,
  showTradingViewDrawAllShape,
  showTradingViewAllIndicator,
  hideTradingViewDrawAllShape,
  hideTradingViewAllIndicator,
  removeTradingViewAllShape,
  removeTradingViewAllIndicator,
  removeTradingViewAllShapeAndIndicator,
  clearTradingViewIndexDb,
  switchTradingViewMaskWrapper,
  tradingViewKeepAlive,
}
