import { defineUserConfig, defaultTheme } from 'vuepress'

export default defineUserConfig({
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
  })
})
