import { makeReceiveMessage } from "@/zero-app-bridge/utils/make-functions.js";
import { channel } from "../utils/channel";

const injectToken = makeReceiveMessage(channel, 'inject_token')
const refreshToken = makeReceiveMessage(channel, 'refresh_token')
const injectSymbolConfig = makeReceiveMessage(channel, 'inject_symbol_config')
const injectUserLogin = makeReceiveMessage(channel, 'inject_user_login')
const changeUserLogin = makeReceiveMessage(channel, 'change_user_login')

const setFullscreen = makeReceiveMessage(channel, 'fullscreen')

export default {
  injectToken,
  refreshToken,
  injectSymbolConfig,
  injectUserLogin,
  setFullscreen,
  changeUserLogin,
}
