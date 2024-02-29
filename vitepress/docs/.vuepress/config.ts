import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { getDirname, path } from 'vuepress/utils'
import { viteBundler } from '@vuepress/bundler-vite'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'

// @ts-ignore
const __dirname = getDirname(import.meta.url)
console.log(registerComponentsPlugin)

export default defineUserConfig({
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),
  theme: defaultTheme({
    sidebar: [
      {
        text: '首页',
        link: '/'
      },
      {
        text: '指引',
        link: '/guide/getting-start',
        children: [
          {
            text: '快速开始',
            link: '/guide/getting-start'
          }
        ]
      },
      {
        text: '组件',
        link: '/components/carousel',
        children: [
          {
            text: '自动滚动',
            link: '/components/carousel'
          }
        ]
      }
    ]
  }),
  plugins: [
    registerComponentsPlugin({
      components: {
        CarouselDemo: path.resolve(__dirname, './components/CarouselDemo.vue')
      }
    })
  ]
})
