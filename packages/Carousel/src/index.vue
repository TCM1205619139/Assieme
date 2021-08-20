<template>
  <div class="carousel-container"
   :class="{
     'carousel-container-hover': isHover,
     'carousel-container-vertical': isVertical,
     'carousel-container-horizontal': !isVertical
   }"
   ref="carousel"
   @mouseleave="mouseleaveHandler"
   @mouseover="mouseoverHandler"
   @scroll="listenScrollFn"
  >
    <div :class="'carousel-item-'+direction" ref="itemList">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    carousel: null,
    rollingTimer: null,
    pauseTimer: null,
    name: "CarouselAlarm",
    top: 0,
    left: 0,
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
        curItemIndex: 0,
        rollingState: false,
      }
    },
    mounted () {
      if (!this.carousel) this.carousel = this.$refs.carousel

      const rect = this.$refs.itemList.getBoundingClientRect()

      this.rollingState = true
      this.top = rect.top
      this.left = rect.left
    },
    methods: {
      mouseleaveHandler () {
        this.isHover = false
        this.rollingState = true
      },
      mouseoverHandler () {
        this.isHover = true
        this.rollingState = false
      },
      listenScrollFn () {
        const rect = this.$refs.itemList.firstChild.getBoundingClientRect()

        if (this.direction === 'vertical') {
          this.curItemIndex = Math.floor((this.top - rect.top) / rect.height)
        } else {
          this.curItemIndex = Math.floor((rect.left - this.left) / rect.width)
        }
      },
      startRolling () {
        this.direction === 'vertical'
        ? this.rollingY()
        : this.rollingX()
      },
      pauseRolling () {
        this.rollingTimer = cancelAnimationFrame(this.rollingTimer)
        this.pauseTimer = clearTimeout(this.pauseTimer)
      },
      rollingX () {
        this.carousel.scrollLeft += this.speed
        this.rollingTimer = requestAnimationFrame(this.rollingX)
      },
      rollingY () {
        this.carousel.scrollTop += this.speed
        this.rollingTimer = requestAnimationFrame(this.rollingY)
      }
    },
    watch: {
      rollingState (newValue) {
        if (newValue) {
          this.startRolling()
        } else {
          this.pauseRolling()
          this.pauseTimer = setTimeout(() => {
            this.rollingState = true
          }, this.pauseTime)
        }
      },
      curItemIndex () {
        this.rollingState = false
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