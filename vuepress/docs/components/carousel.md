# Carousel轮播组件
以插槽中的元素为界限，进行指定方向的滚动显示

<hr/>

### 基本用法
#### 纵向滚动
<carousel-demo-vertical/>

<details>
<summary>展开查看代码</summary>

<<< @/docs/.vuepress/components/CarouselDemoVertical.vue

</details>

<br/>
<hr/>

#### 横向滚动
<carousel-demo-horizontal/>

<details>
<summary>展开查看代码</summary>

<<< @/docs/.vuepress/components/CarouselDemoHorizontal.vue

</details>


### 属性
|       属性            |      描述      |   类型   |      可选值        |   默认值    |
|:-------------------:|:------------:|:------:|:---------------:|:--------:|
|      direction      |     滚动方向     | string |    vertical     | vertical |
|        speed        |     滚动速度     | number |                 |    1     |
|     pause-time      | 滚动间隔暂停时间（ms） | number |                 |    0     |
