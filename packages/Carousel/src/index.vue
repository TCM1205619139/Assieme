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
      :class="{
        '_carousel-container-hover': isHover,
        '_carousel-container-vertical': isVertical,
        '_carousel-container-horizontal': !isVertical,
      }"
      ref="carousel"
      @mouseleave="mouseleaveFn"
      @mouseover="mouseoverFn"
      @scroll="listenScrollFn($event)"
  >
    <div ref="itemList" :class="getClassName">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    rollingTimer: null, // 滚动定时器，用于绑定 requestAnimationFrame
    pauseTimer: null, // 暂停定时器，用于绑定 setTimeout
    name: 'Carousel',
    props: {
      direction: {
        type: String,
        required: false,
        validator: function (value) {
          return ['vertical', 'horizontal'].indexOf(value) !== -1
        },
        default: 'vertical', //'vertical' | 'horizontal'
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
    },
    data() {
      this._itemRect = {}
      this._carouselRect = {}
      this._itemNum = 0
      this._carousel = null
      // this.rollingState = false // 滚动状态,
      // this.onEnd = false // 滚动至最后一个元素停止
      // this.headItemIndex = 0 // 滚动值第几个子元素
      return {
        rollingState: false, // 滚动状态,
        onEnd: false, // 滚动至最后一个元素停止
        headItemIndex: 0, // 滚动值第几个子元素
        isHover: false, // 鼠标是否移入
        isVertical: this.direction === 'vertical',
      }
    },
    computed: {
      getClassName () {
        return this.direction === 'vertical' ? 'carousel-item-vertical' : 'carousel-item-horizontal'
      }
    },
    mounted() {
      this._carousel = this.$refs.carousel
      this._itemList = this.$refs.itemList
      this._itemRect = this.cloneRect(this._itemList.firstChild?.getBoundingClientRect())
      this._carouselRect = this.cloneRect(this._carousel.getBoundingClientRect())
      this.rollingState = true
      this._itemNum = this._itemList.children.length
      this.startRolling()
    },
    methods: {
      rerender () {
        this._carousel = this.$refs.carousel
        this._itemList = this.$refs.itemList
        this._itemRect = this.cloneRect(this._itemList.firstChild?.getBoundingClientRect())
        this._carouselRect = this.cloneRect(this._carousel.getBoundingClientRect())
        this.rollingState = true
        this._itemNum = this._itemList.children.length
      },
      cloneRect(rect) {
        // getBoundingClientRect()是个只读属性，需要进行拷贝
        let newRect = {}
        for (let key in rect) {
          newRect[key] = rect[key]
        }
        return newRect
      },
      mouseleaveFn() {
        this.isHover = false
        this.rerender()
        this.startRolling()
      },
      mouseoverFn() {
        this.isHover = true
        this.rollingState = false
        this.onEnd = false
        this.pauseTimer = clearTimeout(this.pauseTimer)
      },
      listenScrollFn(e) {
        this.rollingState = true
        const height = this._itemRect.height
        const width = this._itemRect.width
        const headItemIndex = this.isVertical
          ? Math.floor(e.target.scrollTop / height)
          : Math.floor(e.target.scrollLeft / width)

        if (this.isHover) {
          // 鼠标滚轮滚动需要更新itemRect的信息
          this._itemRect = this.cloneRect(this._itemList.firstChild.getBoundingClientRect())
        }

        if (this.headItemIndex !== headItemIndex) {
          this.headItemIndex = headItemIndex
          if (!this.isHover && !this.onEnd) this.pauseRolling() // 自动滚动到达停顿位置
        }
      },
      startRolling() {
        // 所有子元素的高度足撑开元素，才需要滚动
        if (this.isVertical && this._itemRect.height * this._itemNum > this._carouselRect.height) {
          this.rollingToY()
        } else if (!this.isVertical && this._itemRect.width * this._itemNum > this._carouselRect.width) {
          this.rollingToX()
        }
      },
      rollingToX() {
        if (this.onEnd || this.isHover) {
          this.rollingState = false
          this.rollingTimer = cancelAnimationFrame(this.rollingTimer)
          this.pauseTimer = setTimeout(this.backRollingX, this.pauseTime)
        } else if (!this.onEnd && !this.isHover) {
          this._itemRect.left -= this.speed
          this._itemRect.right -= this.speed
          this._carousel.scrollLeft += this.speed // 由于这个东西的原因无法把rollingToX与rollingToY合并到一起
          this.onEnd =
            this._itemRect.right + this._itemRect.width * (this._itemNum - 1) <= this._carouselRect.right
          this.rollingTimer = requestAnimationFrame(this.rollingToX)
        }
      },
      rollingToY() {
        if (this.onEnd && !this.isHover) {
          this.rollingState = false
          this.rollingTimer = cancelAnimationFrame(this.rollingTimer)
          this.pauseTimer = setTimeout(this.backRollingY, this.pauseTime)
        } else if (!this.onEnd && !this.isHover) {
          this._itemRect.top -= this.speed
          this._itemRect.bottom -= this.speed
          this._carousel.scrollTop += this.speed // 由于这个东西的原因无法把rollingToX与rollingToY合并到一起
          this.onEnd =
            this._itemRect.bottom + this._itemRect.height * (this._itemNum - 1) <= this._carouselRect.bottom
          this.rollingTimer = requestAnimationFrame(this.rollingToY)
        }
      },
      backRollingX() {
        const firstRect = this._itemRect
        const rect = this._carouselRect
        const scap = firstRect.left - rect.left
        const speed = Math.ceil(-scap / 15) + 1

        if (scap >= -1) {
          this.onEnd = false
          // 已经滚动到头部=
          this.rollingTimer = cancelAnimationFrame(this.rollingTimer)
          this.headItemIndex = 0
          this._carousel.scrollLeft = 0
          this.pauseRolling()
        } else {
          this._carousel.scrollLeft -= speed
          this._itemRect.left += speed
          this._itemRect.right += speed
          this.rollingTimer = requestAnimationFrame(this.backRollingX)
        }
      },
      backRollingY() {
        const firstRect = this._itemRect
        const rect = this._carouselRect
        const scap = firstRect.top - rect.top
        const speed = Math.ceil(-scap / 15) + 1

        if (scap >= -1) {
          this.onEnd = false
          // 已经滚动到头部=
          this.rollingTimer = cancelAnimationFrame(this.rollingTimer)
          this.headItemIndex = 0
          this._carousel.scrollTop = 0
          this.pauseRolling()
        } else {
          this._carousel.scrollTop -= speed
          this._itemRect.top += speed
          this._itemRect.bottom += speed
          this.rollingTimer = requestAnimationFrame(this.backRollingY)
        }
      },
      pauseRolling() {
        this.rollingState = false

        this.rollingTimer = cancelAnimationFrame(this.rollingTimer)
        this.pauseTimer = clearTimeout(this.pauseTimer)

        this.pauseTimer = !this.isHover && setTimeout(this.startRolling, this.pauseTime)
      }
    }
  }
</script>
<style scoped>
  @keyframes layout {
  }
  ._carousel-container {
    width: 100%;
    height: 100%;
    display: flex;
    animation: layout;
    overflow: hidden;
    user-select: none;
  }
  ._carousel-container-hover {
    overflow: auto;
  }
  ._carousel-container-vertical::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
    scrollbar-arrow-color: red;
  }
  ._carousel-container-horizontal::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
    scrollbar-arrow-color: red;
  }
  ._carousel-container::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #324a71;
    scrollbar-arrow-color: red;
  }
  ._carousel-container::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .carousel-item-vertical {
    /*display: flex;*/
    /*flex-direction: column;*/
    /*justify-content: flex-start;*/
    /*align-items: center;*/
  }
  .carousel-item-horizontal {
    display: flex;
    /*flex-direction: row;*/
    /*justify-content: flex-start;*/
    /*align-items: center;*/
  }
</style>
