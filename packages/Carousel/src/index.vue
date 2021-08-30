<template>
  <div class="carousel-container"
   :class="{
     'carousel-container-hover': isHover,
     'carousel-container-vertical': isVertical,
     'carousel-container-horizontal': !isVertical
   }"
     ref="carousel"
     @mouseleave="mouseleaveFn"
     @mouseover="mouseoverFn"
     @scroll="listenScrollFn"
  >
    <div :class="'carousel-item-'+direction" ref="itemList">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import { sleep } from '@/common/tool'

  export default {
    firstChild: null,
    lastChild: null,
    carousel: null, // overflow容器DOM
    rollingTimer: null, // 滚动定时器，用于绑定 requestAnimationFrame
    pauseTimer: null, // 暂停定时器，用于绑定 setTimeout
    name: "CarouselAlarm",
    props: {
      direction: {
        type: String,
        required: false,
        validator: function (value) {
          return ['vertical', 'horizontal'].indexOf(value) !== -1
        },
        default: 'vertical' //'vertical' | 'horizontal'
      },
      speed: {
        type: Number,
        required: false,
        default: 2  // px
      },
      pauseTime: {
        type: Number,
        required: false,
        default: 0  // millisecond
      }
    },
    data () {
      return {
        isHover: false,
        isVertical: this.direction === 'vertical',
        rollingState: false,  // 滚动状态,
        onEnd: false, // 滚动至最后一个元素停止
        headItemIndex: 0,
        bottomItemIndex: null,
        targetItemIndex: 1
      }
    },
    mounted () {
      this.carousel = this.$refs.carousel
      this.lastChild = this.$refs.itemList.lastChild
      this.firstChild = this.$refs.itemList.firstChild

      const rect = this.$refs.itemList.getBoundingClientRect()
      const firstRect = this.$refs.itemList.firstChild.getBoundingClientRect()

      if (this.isVertical && firstRect.bottom < rect.bottom) {
        this.top = rect.top
        this.bottom = rect.bottom
      } else if (!this.isVertical && firstRect.right < rect.right) {
        this.left = rect.left
        this.right = rect.right
      }

      this.startRolling()
    },
    methods: {
      mouseleaveFn () {
        this.isHover = false
        this.rollingState = true
        this.startRolling()
      },
      mouseoverFn () {
        this.isHover = true
        this.rollingState = false
        this.pauseRolling()
      },
      listenScrollFn () {
        const firstRect = this.firstChild.getBoundingClientRect()
        const rect = this.carousel.getBoundingClientRect()

        if (this.isVertical) {
          this.bottomItemIndex = Math.ceil((rect.bottom - firstRect.bottom) / firstRect.height)
          this.headItemIndex = Math.floor((rect.top - firstRect.top) / firstRect.height)
        } else {
          this.bottomItemIndex = Math.ceil((rect.right - firstRect.right) / firstRect.width)
          this.headItemIndex = Math.ceil((rect.left - firstRect.left) / firstRect.width)
        }
        if (this.headItemIndex !== this.targetItemIndex - 1 && !this.onEnd) {
          this.targetItemIndex = this.headItemIndex + 1
          this.pauseRolling()
        }

      },
      startRolling () {
        this.pauseTimer = clearTimeout(this.pauseTimer)
        this.rollingTimer = cancelAnimationFrame(this.rollingTimer)
        this.rollingState = true

        this.isVertical
        ? this.rollingToY(this.targetItemIndex)
        : this.rollingToX(this.targetItemIndex)
      },
      rollingToX () {
        const lastRect = this.lastChild.getBoundingClientRect()
        const rect = this.carousel.getBoundingClientRect()

        if (lastRect.right <= rect.right) { // 滚动到最底部
          this.onEnd = true
          sleep(this.backRollingX, this.pauseTime)
        } else {
          this.carousel.scrollLeft += this.speed
          this.rollingTimer = requestAnimationFrame(() => {
            this.rollingToX(this.targetItemIndex)
          })
        }
      },
      rollingToY () {
        const lastRect = this.lastChild.getBoundingClientRect()
        const rect = this.carousel.getBoundingClientRect()

        if (lastRect.bottom <= rect.bottom) { // 滚动到最底部
          this.onEnd = true
          sleep(this.backRollingY, this.pauseTime)
        } else {
          this.carousel.scrollTop += this.speed
          this.rollingTimer = requestAnimationFrame(() => {
            this.rollingToY(this.targetItemIndex)
          })
        }
      },
      backRollingX () {
        const firstRect = this.firstChild.getBoundingClientRect()
        const rect = this.carousel.getBoundingClientRect()

        const scap = firstRect.left - rect.left
        const speed = Math.ceil( -scap / 15) + 1

        if (scap >= -1) {  // 已经滚动到头部
          this.carousel.scrollLeft = 0
          this.onEnd = false
          this.rollingTimer = cancelAnimationFrame(this.rollingTimer)
          this.pauseRolling()
        } else {
          this.carousel.scrollLeft -= speed
          this.rollingTimer = requestAnimationFrame(this.backRollingX)
        }
      },
      backRollingY () {
        const firstRect = this.firstChild.getBoundingClientRect()
        const rect = this.carousel.getBoundingClientRect()

        const scap = firstRect.top - rect.top
        const speed = Math.ceil( -scap / 15) + 1

        if (scap >= -1) {  // 已经滚动到头部
          this.carousel.scrollTop = 0
          this.onEnd = false
          this.rollingTimer = cancelAnimationFrame(this.rollingTimer)
          this.pauseRolling()
        } else {
          this.carousel.scrollTop -= speed
          this.rollingTimer = requestAnimationFrame(this.backRollingY)
        }
      },
      pauseRolling () {
        this.rollingState = false

        cancelAnimationFrame(this.rollingTimer)
        clearTimeout(this.pauseTimer)

        this.pauseTimer = !this.isHover && setTimeout(this.startRolling, this.pauseTime)
      }
    },
    watch: {
      bottomItemIndex (index) {
        this.$emit('bottom-change', index)
      },
      headItemIndex (index) {
        this.$emit('top-change', index)
      },
      onEnd (value) {
        if (value) this.$emit('on-end', value)
      }
    }
  }
</script>

<style scoped>
  @keyframes layout {
  }
  .carousel-container {
    width: 100%;
    height: 100%;
    display: flex;
    animation: layout;
    overflow: hidden;
    user-select: none;
  }
  .carousel-container-hover {
    overflow: auto;
  }
  .carousel-container-vertical::-webkit-scrollbar {/*滚动条整体样式*/
    width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
    scrollbar-arrow-color:red;
  }
  .carousel-container-horizontal::-webkit-scrollbar {/*滚动条整体样式*/
    width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
    scrollbar-arrow-color:red;
  }
  .carousel-container::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #324a71;
    scrollbar-arrow-color:red;
  }
  .carousel-container::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
  .carousel-item-vertical {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .carousel-item-horizontal {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
</style>