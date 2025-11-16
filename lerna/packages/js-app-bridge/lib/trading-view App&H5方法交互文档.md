# trading-view 第二版本
> App 中的 chart 模块不能全部做到 H5中，只能保持当前状态。因为会弹出抽屉，需要将底部的tab覆盖掉

## 一、方法定义
### App 通知 H5（调用H5的全局方法）
1. 注入 token
```typescript
type Token = {
    idToken: string
}

window.bridge.common.injectToken(Token)
```
1. 更新 token
```typescript
type Token = {
    idToken: string
}

window.bridge.common.refreshToken(Token)
```

2. 注入symbol信息，接口获取，传入当前需要查看的symbol的信息即可
```typescript
type symbolConfig = {...}

window.bridge.common.injectSymbolConfig(symbolConfig)
```

3. 注入 userLogin, 用于查询用户报价交易信息
```typescript
type userLogin = {
    userLoging: string
}
// 初始化注入
window.bridge.common.injectUserLogin(userLogin)
// 账户切换调用
window.bridge.common.changeUserLogin(userLogin)
```

4. 注入图表初始化
> 预览和chart两个view的配置不一样
```typescript
type Config = {
    symbol: string,
    locale: string,
    interval: '1' | '5' | '15' | '30' | '60' | '120' | '240' | '1D' | '1W' | '1M', 
    theme: 'dark' | 'light',
    // 预览页传入，不传默认为'1D'
    visableType: '1D' | '1W' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | '5Y' | 'ALL',
    ...
}

window.bridge.trading.injectTradingViewChartConfig(Config)
```

5. 设置 symbol
```typescript
type symbol = {
    symbol: string
}

window.bridge.trading.setTradingViewSymbol(symbol)
```
6. 设置横轴查看范围
```typescript
type visableType = {
    visableType: '1D' | '1W' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | '5Y' | 'ALL'
}

window.bridge.setTradingViewVisableRange(visableType)
```
7. 设置图表线条类型的方法
```typescript
// Bars(0)、Candles(1)、Line(2)、Area(3) HollowCandles(9)
type ChartType = {
    chartType: 0 | 1 | 2 | 3 | 9
}

window.bridge.trading.setTradingViewChartType(ChartType)
```
8. 设置 resolution
```typescript
type Resolution = {
    interval: '1' | '5' | '15' | '30' | '60' | '120' | '240' | '1D' | '1W' | '1M'
}

window.bridge.trading.setTradingViewResolution(Resolution)
```
9. 设置 indicator 指标
```typescript

window.bridge.trading.setTradingViewIndicator()
```

10. 进入绘制线条状态
> 六种线条绘制每种提供对应的方法
```typescript
window.bridge.trading.startTradingViewDrawHorizontalLine()
window.bridge.trading.startTradingViewDrawVerticalLine()
window.bridge.trading.startTradingViewDrawTrendLine()
window.bridge.trading.startTradingViewDrawTrendAngle()
window.bridge.trading.startTradingViewDrawArrow()
window.bridge.trading.startTradingViewDrawParallelChannel()

```
11. 图形和指标操作
> 
```typescript

window.bridge.trading.showTradingViewDrawAllShape()
window.bridge.trading.showTradingViewAllIndicator()
window.bridge.trading.hideTradingViewDrawAllShape()
window.bridge.trading.hideTradingViewAllIndicator()
window.bridge.trading.removeTradingViewAllShape()
window.bridge.trading.removeTradingViewAllIndicator()
window.bridge.trading.removeTradingViewAllShapeAndIndicator()

```
12. 清空trading-view图表缓存
```typescript
window.bridge.trading.clearTradingViewIndexDb()
```

13. trading页面遮罩层显示与隐藏切换
```typescript
type params = {
    show: true | false
}
window.bridge.trading.switchTradingViewMaskWrapper(params)
```

> 补充方法

12. App生命周期
```typescript
// App 前台进后台
window.bridge.lifecycle.onApplicationDeactivated()

// App 从后台唤起
window.bridge.lifecycle.onApplicationActivated()
```
13. 网络波动(关闭网络|打开网络|切换网络)
```typescript

window.bridge.network.stateChange()
```
14. 后续新增一些交互方法
```typescript
// 公共的会直接挂载到 window.bridge 下，例如：

window.bridge.xxxx()
```


## 二、H5 将自身状态通知给 App
1. 图表渲染成功
```typescript
window.flutter_inappwebview.callHandler('trading_view_render_success')
```
2. H5 页面初始化完成
```typescript
window.flutter_inappwebview.callHandler('h5_render_success')
```
3. 图表渲染失败
```typescript
window.flutter_inappwebview.callHandler('trading_view_render_error', Error)
```
4. token鉴权错误
```typescript
window.flutter_inappwebview.callHandler('auth_token_error', Error)
```
5. socket 断连或网络错误
```typescript
type NetworkError = {
    type: 'network_error' | 'fail' | 'timeout',
    message: string,
    payload: unknown,
    code: number
}
```
6. 全局捕获的一些意外错误
```typescript
window.flutter_inappwebview.callHandler('h5_global_error_capture', Error)
```
7. 图表时间间隔变更成功
```typescript
window.flutter_inappwebview.callHandler('trading_view_resolution_change', Error)
```
8. 图表symbol变更成功
```typescript
window.flutter_inappwebview.callHandler('trading_view_symbol_change', Error)
```
