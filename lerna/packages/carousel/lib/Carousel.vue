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
    ref="carousel"
    class="_carousel-container"
    :class="{
      '_carousel-container-hover': isMouseEnter,
      '_carousel-container-vertical': isVertical,
      '_carousel-container-horizontal': !isVertical,
    }"
    @mouseleave="mouseleaveFn"
    @mouseover="mouseoverFn"
  >
    <div class="start" ref="start"></div>
    <div ref="itemList" :class="getClassName">
      <slot></slot>
    </div>
    <div class="end" ref="end"></div>
  </div>
</template>

<script>
import { tween } from 'shifty';

export default {
  rollingTimer: null, // 滚动定时器，用于绑定 requestAnimationFrame
  pauseTimer: null, // 暂停定时器，用于绑定 setTimeout
  name: 'Carousel',
  props: {
    direction: {
      type: String,
      required: false,
      validator: function (value) {
        return ['vertical', 'horizontal'].indexOf(value) !== -1;
      },
      default: 'vertical', //'vertical' | 'horizontal'
    },
    speed: {
      type: Number,
      required: false,
      default: 1, // px
    },
    pauseTime: {
      type: Number,
      required: false,
      default: 0, // millisecond
    },
  },
  data() {
    // TODO 可以通过设置每一帧滚动步长进行滚动（已实现），也可以通过设置滚动持续时间进行滚动（未实现）
    this.animation = null
    this.pauseTimer = null  // 暂停滚动定时器
    this.resizeObservers = [] // 收集slot中所有的子元素 --- 监听大小改变
    this.intersectionObservers = []  // 收集slot中所有的子元素 --- 监听出现/离开
    this.startIntersectionObserver = null // 监听第一个宽高为0的元素
    this.endIntersectionObserver = null // 监听最后一个宽高为0的元素
    return {
      isMouseEnter: false,  // 鼠标是否移入
      index: -1,  // 当前滚动到哪一个元素，从左往右，从上往下
      isBackRolling: false, // 是否回滚中
      isInStart: false, // 是否滚动到第一个
      isInEnd: false,  // 是否滚动到最后一个
      needResize: false,
    };
  },
  computed: {
    scrollSpeed() {
      return this.speed + 1;
    },
    isVertical() {
      return this.direction === 'vertical';
    },
    getClassName() {
      return this.isVertical
        ? 'carousel-item-vertical'
        : 'carousel-item-horizontal';
    },
  },
  watch: {
    needResize: {
      immediate: false,
      handler (val) {
        if (!val) return
        this.pauseRolling().then(this.startRolling)
        this.createObservers()
      }
    }
  },
  mounted() {
    // TODO 如果外层改变了 $slots 的内容，会导致瞬间闪烁到最顶部，需要优化
    this.createObservers()
    // this.startRolling()
  },
  beforeDestroy() {
  },
  methods: {
    createObservers () {
      const slotNodes = this.$refs.itemList.childNodes || []

      const items = Array.from(slotNodes).filter(node => {
        return node.nodeType === 1
      })
      this.resizeObservers.forEach((observer) => {
        observer.disconnect()
      })
      this.intersectionObservers.forEach(observer => {
        observer.disconnect()
      })
      this.resizeObservers = []
      this.intersectionObservers = []

      for (const element of items) {
        const resizeObserver = new ResizeObserver(() => {
          this.needResize = true
        })
        const intersectionObserver = new IntersectionObserver((entry) => {
          const { isIntersecting } = entry[0]
          if (isIntersecting) return
          this.pauseRolling().then(this.startRolling)
        })
        this.startIntersectionObserver = new IntersectionObserver((entry) => {
          const { isIntersecting } = entry[0]
          this.isInStart = isIntersecting
        })
        this.endIntersectionObserver = new IntersectionObserver((entry) => {
          const { isIntersecting } = entry[0]
          this.isInEnd = isIntersecting
        })

        resizeObserver.observe(element)
        intersectionObserver.observe(element)

        this.startIntersectionObserver.observe(this.$refs.start)
        this.endIntersectionObserver.observe(this.$refs.end)
        this.resizeObservers.push(resizeObserver)
        this.intersectionObservers.push(intersectionObserver)
      }
    },
    startRolling () {
      if (this.isInEnd) {
        cancelAnimationFrame(this.animation)
        this.pauseRolling().then(this.rollingToStart)
        return
      }
      if (this.isMouseEnter) {
        cancelAnimationFrame(this.animation)
        this.pauseRolling().then(this.startRolling)
        return;
      }
      this.rollingToEnd()
      this.animation = requestAnimationFrame(this.startRolling)
    },
    pauseRolling () {
      return new Promise(resolve => {
        cancelAnimationFrame(this.animation)
        this.pauseTimer = clearTimeout(this.pauseTimer)
        this.pauseTimer = setTimeout(() => {
          resolve()
        }, this.pauseTime)
      })
    },
    rollingToEnd () {
      if (this.isVertical) {
        this.$refs.carousel.scrollTop += this.speed
      } else {
        this.$refs.carousel.scrollLeft += this.speed
      }
    },
    rollingToStart () {
      const carousel = this.$refs.carousel
      const scrollTop = carousel.scrollTop
      const scrollLeft = carousel.scrollLeft
      tween({
        render({ x, y }) {
          this.isBackRolling = true
          carousel.scrollLeft = x;
          carousel.scrollTop = y;
        },
        easing: 'easeInOutCubic',
        duration: this.pauseTime,
        from: {
          y: scrollTop,
          x: scrollLeft
        },
        to: {
          y: 0,
          x: 0
        },
      })
        .then(() => {
          this.isBackRolling = false
          return this.pauseRolling()
        })
        .then(() => {
          this.startRolling();
        });
    },
    mouseleaveFn () {
      this.isMouseEnter = false
    },
    mouseoverFn () {
      this.isMouseEnter = true
    }
  }
};
</script>
<style scoped lang="scss">

._carousel-container {
  width: 100%;
  height: 100%;
  display: flex;
  animation: layout;
  overflow: auto;
  user-select: none;
}

._carousel-container-hover {
  overflow: auto;
}

._carousel-container-vertical {
  flex-direction: column;

  .carousel-item-vertical {
    display: flex;
    flex-direction: column;
  }

  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
}

._carousel-container-horizontal {
  flex-direction: row;

  .carousel-item-horizontal {
    display: flex;
    flex-direction: row;
  }

  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
}

._carousel-container::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}

._carousel-container::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
}

.start, .end {
  width: 1px;
  height: 1px;
}
</style>
