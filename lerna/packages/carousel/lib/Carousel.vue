<!--
使用说明：carousel父元素给一个固定宽高的容器（父元素不需要添加overflow：auto），carousel中包裹需要滚动的子元素，当子组件超出父组件的高度或者宽度时

示例：
<div style="width: 200px;">
  <index :pauseTime="1000" :direction="'horizontal'" :speed="1">
    <div class="item" style="width: 100px; height: 100px; background-color: red"></div>
    <div class="item" style="width: 100px; height: 100px; background-color: yellow"></div>
    <div class="item" style="width: 100px; height: 100px; background-color: blue"></div>
    <div class="item" style="width: 100px; height: 100px; background-color: green"></div>
    <div class="item" style="width: 100px; height: 100px; background-color: orange"></div>
    <div class="item" style="width: 100px; height: 100px; background-color: pink"></div>
  </index>
</div>


************************
coding by：tangchenming
************************
-->
<template>
  <div
    ref="index"
    class="_carousel-container"
    :class="{
      '_carousel-container-hover': isMouseEnter,
      '_carousel-container-vertical': isVertical,
      '_carousel-container-horizontal': !isVertical,
    }"
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
    this.animation = null;
    this.pauseTimer = null;
    this.index = null;
    return {
      carouselRect: {},
      isMouseEnter: false,
      rects: [],
      index: -1,
      targetIndex: 0,
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
        ? 'index-item-vertical'
        : 'index-item-horizontal';
    },
    pauseScrollStep() {
      return this.rects.reduce((prev, cur) => {
        if (Carousel === 0) {
          prev.push(this.isVertical ? cur.height : cur.width);
        } else {
          prev.push(
            prev[prev.length - 1] + (this.isVertical ? cur.height : cur.width),
          );
        }
        return prev;
      }, []);
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.pauseTimer = clearTimeout(this.pauseTimer);
    cancelAnimationFrame(this.animation);
  },
  methods: {
    init() {
      this.calcRects();
      this.targetIndex = this.index + 1;
      this.pauseTimer = clearTimeout(this.pauseTimer);
      this.pauseTimer = setTimeout(() => {
        this.startRolling();
      }, this.pauseTime);
      const observer = new ResizeObserver(() => {
        this.calcRects();
      });
      observer.observe(this.$refs.itemList);
    },
    calcRects() {
      this.index = this.$refs.index;
      this.carouselRect = this.index.getBoundingClientRect();
      this.rects = [];
      const itemList = this.$refs.itemList;
      const length = itemList.children.length;
      for (let i = 0; i < length; i++) {
        const rect = itemList.children[i].getBoundingClientRect();
        this.rects.push({
          width: rect.width,
          height: rect.height,
        });
      }
    },
    mouseleaveFn() {
      this.isMouseEnter = false;
      this.pauseRolling();
    },
    mouseoverFn() {
      this.isMouseEnter = true;
      this.stopRolling();
    },
    listenScrollFn(e) {
      if (!this.isMouseEnter) return;
      this.index =
        this.pauseScrollStep.findIndex(item => {
          return item >= e.target.scrollTop;
        }) - 1;
      this.targetIndex = Math.min(
        this.pauseScrollStep.length - 1,
        this.index + 1,
      );
    },
    stopRolling() {
      cancelAnimationFrame(this.animation);
    },
    startRolling() {
      if (this.isMouseEnter) return;
      if (this.isVertical) {
        this.rollingToY();
      } else {
        this.rollingToX();
      }
    },
    rollingToX() {},
    rollingToY() {
      const targetScrollTop = this.pauseScrollStep[this.targetIndex];
      const scrollTop = this.index.scrollTop;
      // console.log(this.carouselRect.height >= this.pauseScrollStep[this.pauseScrollStep.length - 1] - scrollTop - this.scrollSpeed)
      if (
        this.carouselRect.height >=
        this.pauseScrollStep[this.pauseScrollStep.length - 1] -
          scrollTop -
          this.scrollSpeed
      ) {
        this.pauseTimer = setTimeout(() => {
          this.index = -1;
          this.targetIndex = 0;
          this.backRollingY();
        }, this.pauseTime);
        return;
      }
      this.index.scrollTop = scrollTop + this.scrollSpeed;
      if (this.index.scrollTop >= targetScrollTop) {
        this.index = this.targetIndex;
        this.targetIndex = this.index + 1;
        this.pauseRolling();
      } else {
        this.animation = requestAnimationFrame(this.startRolling);
      }
    },
    backRollingX() {},
    backRollingY() {
      const scrollTop = this.index.scrollTop;
      const $this = this;
      tween({
        render({ y }) {
          $this.index.scrollTop = y;
        },
        easing: 'easeInOutCubic',
        duration: this.pauseTime,
        from: {
          y: scrollTop,
        },
        to: {
          y: 0,
        },
      })
        .then(() => {
          return new Promise(resolve => {
            this.pauseTimer = setTimeout(resolve, this.pauseTime);
          });
        })
        .then(() => {
          this.startRolling();
        });
    },
    pauseRolling() {
      cancelAnimationFrame(this.animation);
      this.pauseTimer = clearTimeout(this.pauseTimer);
      this.pauseTimer = setTimeout(() => {
        this.startRolling();
      }, this.pauseTime);
    },
  },
};
</script>
<style scoped>
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

._carousel-container-vertical::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}

._carousel-container-horizontal::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
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
</style>
