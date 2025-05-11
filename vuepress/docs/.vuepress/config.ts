import { defineConfig } from 'vuepress/config'

export default defineConfig({
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  port: 8087,
  patterns: [
    '**/*.md',
    '**/*.vue',
    '**/*.js',
    '**/*.ts',
    '**/*.scss',
    '**/*.css',
    '**/*.less'
  ],
  themeConfig: {
    sidebar: [
      {
        title: '首页',
        path: '/'
      },
      {
        title: '指引',
        path: '/guide/getting-start',
        collapsable: false,
        children: [
          {
            title: '快速开始',
            path: '/guide/getting-start'
          }
        ]
      },
      {
        title: '组件',
        path: '/components/carousel',
        children: [
          {
            title: '自动滚动',
            path: '/components/carousel'
          }
        ]
      }
    ]
  }
});
