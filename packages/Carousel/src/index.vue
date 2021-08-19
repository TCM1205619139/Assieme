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
  >
    <div :class="'carousel-item-'+direction">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    carousel: null,
    animationFrame: null,
    scrollKey: '',
    scrollSizeKey: '',
    clientKey: '',
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
        default: 2
      },
      pauseTime: {
        type: Number,
        required: false,
        default: 3  // second
      }
    },
    data () {
      return {
        isHover: false,
        isVertical: this.direction === 'vertical'
      }
    },
    mounted () {
      if (!this.carousel) this.carousel = this.$refs.carousel
      this.setScrollDirection()
    },
    methods: {
      mouseleaveHandler () {
        console.log();
        this.isHover = false
        this.startRolling()
      },
      mouseoverHandler () {
        this.isHover = true
        this.pauseRolling()
      },
      setScrollDirection () {
        if (this.direction === 'vertical') {
          this.scrollKey = 'scrollTop',
          this.scrollSizeKey = 'scrollHeight',
          this.clientKey = 'clientHeight'
        } else {
          this.scrollKey = 'scrollLeft'
          this.scrollSizeKey = 'scrollWidth'
          this.clientKey = 'clientWidth'
        }

        this.startRolling()
      },
      startRolling () {
        const scrollKey = this.carousel[this.scrollKey]
        const scrollSizeKey = this.carousel[this.scrollSizeKey]
        const clientKey = this.carousel[this.clientKey]

        if (scrollKey + clientKey < scrollSizeKey) {
          this.carousel[this.scrollKey] += this.speed
        }

        this.animationFrame = requestAnimationFrame(this.startRolling)
      },
      pauseRolling () {
        cancelAnimationFrame(this.animationFrame)
      }
    },
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

  .image-card-container {
    margin: 10px 5px;
  }

</style>