import bridge from '@/zero-app-bridge/index.js'
import { makePostMessage } from '@/zero-app-bridge/utils/make-functions.js'
import { SYMBOL_EURUSD, SYMBOL_GBPUSE, SYMBOL_NZDUSD, SYMBOL_USDJPY } from '@/constant/widget.js'
import { timeframeToResolution } from '@/trading-view/action.js'
import { debounce } from 'lodash'

const isDEV = import.meta.env.MODE === "development"
/**
 * 这个文件中的方法就是将信息上报给app的
 */

/**
 * trading-view 特有通知事件
 * @type {function(...[*]): *}
 */
export const postMessageTradingViewRenderSuccess2App = debounce(makePostMessage('trading_view_render_success'), 200)
export const postMessageTradingViewRenderError2App = makePostMessage('trading_view_render_error')
export const postMessageTradingViewResolutionChange2App = makePostMessage('trading_view_resolution_change')
export const postMessageTradingViewSymbolChange2App = makePostMessage('trading_view_set_symbol_success')
export const postMessageTradingViewVisibleChange2App = makePostMessage('trading_view_visible_change')
export const postMessageTradingViewClosePosition2App = makePostMessage('trading_view_close_position')
export const postMessageTradingViewCloseOrder2App = makePostMessage('trading_view_close_order')

/**
 * 通用通知App方法
 * @type {function(...[*]): *}
 */
export const postMessageH5RenderSuccess2App = () => {
  // 模拟注入token，用户信息，图表配置等，仅在开发环境下使用
  if (isDEV && !window.flutter_inappwebview) {
    setTimeout(() => {
      bridge.common.injectToken(JSON.stringify({"idToken":"eyJraWQiOiJtclVrelwvTGFDZGJBc280NmVzN1BwVzZPQ3VYZ1pOK3ROc0krMGVIOHlQaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1NjYwZTliZS1lNjBlLTQ2ZjUtYTE5Yi1kYWMzZWY3NzE0NmMiLCJjb2duaXRvOmdyb3VwcyI6WyJQb3J0YWwiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tXC9hcC1ub3J0aGVhc3QtMV8weFl0VzlaRHIiLCJjdXN0b206dXNlcl9pZCI6IjEwODcwNjUiLCJjb2duaXRvOnVzZXJuYW1lIjoiYWMxMzEzN2ViN2QyNDQwZDk4NTlkMTdmM2FhNmJiMjMiLCJjdXN0b206dGVuYW50X2lkIjoiMSIsIm9yaWdpbl9qdGkiOiI5MzU4NTY4Zi1lYjk0LTRiNjQtYjBlMC0xNjZkMjFlNDk2OTQiLCJhdWQiOiIyOGxwZjB2OWhjN2VwaTg2NzllYW84MThxcCIsImV2ZW50X2lkIjoiYzBhNDZmYjQtYjI0ZC00MTU1LWI1ZmQtNWQ4MTE1MTY1ZWIxIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NjI3NzE1ODUsImV4cCI6MTc2Mjc4NzQ3MiwiaWF0IjoxNzYyNzc2NjczLCJlbWFpbCI6ImNoZW5taW5ndGFuZ0BkZG1hcmtldGluZ2h1Yi5jb20iLCJqdGkiOiI5N2QwYjkxNC0zYTU4LTQ2ODYtODQxNS00M2IyM2YzZTBiMjcifQ.AwuI-idrOjEAd11dyrbqTAa_3hNV_L53qtL4IL8WBgrTGg_1Aj-dJ9CpugbI2FNObrcCmGZ-48xuR_EVs1zlZRwc_ob96jz0qk297Q4fS0nZh7lGR9vRxVcz2W54SdAdMvouuOzh9t-SNItTNtpHKYRCxYHbBVp9iilGRs3x6JNd7-QfWNI2pXXdZvqPC38JLjfkhWJbru5xbQMuzTAtko-5rIwUWvrzcXl6a8NGSoAdCq6UWx8H6QIYoj7QtbUu7Fz8CCaqKsP4Eyicr3Mqc5h_J7MRhG-kOg9BZimRQDyF2KFKGKEpg0medQ7240-68MrwtMG1kaQ5eYLkq-aKFg"}))

      bridge.common.injectUserLogin(JSON.stringify({
        userLogin: 158018965
      }))

      bridge.common.injectSymbolConfig(JSON.stringify(SYMBOL_USDJPY))
      const timeframe = '1D'
      bridge.trading.injectTradingViewChartConfig(JSON.stringify({
        locale: 'chinese',
        symbol: 'EURUSD',
        fullscreen: true,
        interval: '1',
        theme: 'dark',
        timeframe: timeframe,
        lineType: 3,
      }))
    }, 1e3)
  }
  return makePostMessage('h5_render_success')()
}
export const postMessageAuthTokenError2App = makePostMessage('auth_token_error')
export const postMessageH5GlobalError2App = makePostMessage('h5_global_error_capture')
export const postMessageH5RunLog = makePostMessage('h5_run_log')

/**
 * 网络相关，分以下两类
 * 1. socket
 * 2. fetch / xhr
 */
export const WebSocketErrorMessage = {
  network: new Error(),
  fail: new Error(),
  timeout: new Error()
}

export const postMessageSocketError2App = makePostMessage('websocket_error');
export const postMessageSocketClose2App = makePostMessage('websocket_close');
export const postMessageSocketErrorResponse2App = makePostMessage('websocket_error_response');


