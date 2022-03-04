<!--
使用说明：carousel父元素给一个固定宽高的容器（父元素不需要添加overflow：auto），carousel中包裹需要滚动的子元素，当子组件超出父组件的高度或者宽度时

示例：
<div style="width: 200px;">
  <carousel :pauseTime="1000" :direction="'horizontal'" :speed="1">
    <div class="item" style="width: 100px; height: 100px; background-color: red"></div>
    <div class="item" style="width: 100px; height: 100px; background-color: yellow"></div>
    <div class="item" style="width: 100px; height: 100px; background-color: blue"></div>
    <div class="item" style="width: 100px; height: 100px; background-color: green"></div>
    <div class="item" style="width: 100px; height: 100px; background-color: orange"></div>
    <div class="item" style="width: 100px; height: 100px; background-color: pink"></div>
  </carousel>
</div>


************************
coding by：tangchenming
************************
-->
<template>
  <div
      class="_carousel-container"
      :class="getContainerClassName"
      ref="listContainer"
      @mouseenter="onmouseenter"
      @mouseleave="onmouseleave"
      @scroll="onscroll"
  >
    <slot name="default"></slot>
  </div>
</template>

<script>
  export default {
    name: 'Carousel',
    props: {
      direction: {
        required: false,
        validator (value) {
          return ['vertical', 'horizontal'].indexOf(value) !== -1
        },
        default: 'vertical'
      },
      speed: {
        type: Number,
        required: false,
        default: 2, // px
      },
      pauseTime: {
        type: Number,
        required: false,
        default: 0, // millisecond
      },
      customClass: {
        type: String,
        required: false,
        default: ''
      },
      renderId : {
        required: false,
        default: ''
      }
    },
    data() {
      this.carouselContainer = null
      this.listContainer = null
      this.children = []
      this.observers = []
      this.timer = null
      this.requestAnimationTimer = null
      return {
        rollingState: false, // 滚动状态,
        isHover: false, // 鼠标是否移入
        startIndex: 0,
        onEnd: false
      }
    },
    computed: {
      isVertical () {
        return this.direction === 'vertical'
      },
      getContainerClassName () {
        const classDict = {
          'vertical': '_carousel-container-vertical',
          'horizontal': '_carousel-container-horizontal'
        }
        return [classDict[this.direction], this.customClass]
      },
    },
    watch: {
      renderId (nVal, oVal) {
        if (oVal === undefined) return
        this.$nextTick(() => {
          this.timer = clearTimeout(this.timer)
          this.requestAnimationTimer = cancelAnimationFrame(this.requestAnimationTimer)
          this.initElement()
          this.createAnimationTimer()
          // this.createObserver()
        })
      },
      onEnd (nVal) {
        if (!nVal) return
        this.requestAnimationTimer = cancelAnimationFrame(this.requestAnimationTimer)
        this.scrollIntoView(this.listContainer.children[0])
      }
    },
    mounted () {
      this.initElement()
      this.createAnimationTimer()
      // this.createObserver()
    },
    methods: {
      initElement () {
        this.children = []
        this.carouselContainer = this.$refs.carouselContainer
        this.listContainer = this.$refs.listContainer

        const length = this.listContainer.children.length

        for (let i=0; i<length; i++) {
          this.listContainer.children[i].style['flex-shrink'] = 0
          this.children.push(this.listContainer.children[i])
        }
      },
      createObserver () {
        this.observers = this.children.map((el, index) => {
          if (this.observers[index]) {
            this.observers[index].unobserve(el)
          }
          const observer = new IntersectionObserver(this.observerCallback)

          observer.observe(el)
          observer.index = index

          return observer
        })
      },
      observerCallback (entry, observer) {
        if (entry[0].boundingClientRect.y > 0) return
        this.startIndex = observer.index + 2
      },
      createAnimationTimer () {
        this.timer = setTimeout(() => {
          if (this.startIndex >= this.children.length) {
            this.startIndex = 0
          }
          this.scrollIntoView(this.children[this.startIndex])
        }, this.pauseTime)
      },
      /**
       * 使某一个元素滚动到第一个位置（最左或最上）
       * @param element {HTMLElement}
       */
      scrollIntoView (element) {
        if (this.requestAnimationTimer) {
          this.requestAnimationTimer = cancelAnimationFrame(this.requestAnimationTimer)
        }
        let distance
        let offsetKey
        let scrollKey
        let scroll
        let dir = 1
        let repeatNum = 0

        if (this.isVertical) {
          offsetKey = 'offsetTop'
          scrollKey = 'scrollTop'
        } else {
          offsetKey = 'offsetLeft'
          scrollKey = 'scrollLeft'
        }
        scroll = this.listContainer[scrollKey]
        distance = Math.abs(element[offsetKey] - scroll)
        element[offsetKey] - scroll >= 0 ? dir = 1 : dir = -1

        const requestAnimationFrameFn = () => {
          if (distance <= 0) {
            this.requestAnimationTimer = cancelAnimationFrame(this.requestAnimationTimer)
            this.createAnimationTimer()
            this.startIndex++
            return
          }

          if (dir === -1) {
            const scrolling = Math.ceil(distance / 25) * this.speed
            scroll -= scrolling
            distance -= scrolling
          } else {
            scroll += this.speed * dir
            distance -= this.speed
          }

          if (this.listContainer[scrollKey] === scroll) {
            repeatNum++
          }

          if (repeatNum > 1) {
            this.onEnd = true
            return
          }

          this.onEnd = false
          this.listContainer[scrollKey] = scroll

          this.requestAnimationTimer = requestAnimationFrame(requestAnimationFrameFn)
        }
        this.requestAnimationTimer = requestAnimationFrame(requestAnimationFrameFn)
      },
      onmouseenter () {
        this.isHover = true
        this.requestAnimationTimer = cancelAnimationFrame(this.requestAnimationTimer)
        this.timer = clearTimeout(this.timer)
      },
      onmouseleave () {
        this.isHover = false
        if (this.isVertical) {
          const containerScrollTop = this.listContainer.scrollTop
          const itemHeight = this.children[0].offsetHeight

          this.startIndex = Math.ceil(containerScrollTop / itemHeight)
        } else {
          const containerScrollLeft = this.listContainer.scrollLeft
          const itemWidth = this.children[0].offsetWidth

          this.startIndex = Math.ceil(containerScrollLeft / itemWidth)
        }
        this.createAnimationTimer()
      },
      onscroll () {

      }
    }
  }
</script>
<style scoped>
  ._carousel-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  ._carousel-container-vertical {
  }

  ._carousel-container-horizontal {
    display: flex;
  }
</style>
