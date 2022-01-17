<template>
  <div
    class="_drag-box"
    :style="boxStyle"
    @mouseup="onMouseup"
    @mousedown="onMousedown"
    ref="dragBox"
  >
    <div class="_drag-box-content" :class="{ 'prevent-event': preventEvent }">
      <slot name="default"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: "DragBox",
    props: {
      size: {
        type: Array,
        required: true,
      },
      resizable: {
        type: Boolean,
        required: false,
        default: true
      },
      draggable: {
        type: Boolean,
        required: false,
        default: true
      },
      shake: {
        type: Number,
        required: false,
        default: 0,
        validator (value) {
          return value >= 0
        }
      },
      overflowRevert : {
        type: Boolean,
        required: false,
        default: true
      }
    },
    data () {
      this.primartPosition = {
        x: 0,
        y: 0
      }
      this.shakePosition = {
        x: 0,
        y: 0
      }
      this.dragBox = null
      return {
        dragging: false,
        resizing: false,
        fullSize: false,
        preventEvent: false
      }
    },
    computed: {
      boxStyle () {
        return this.fullSize
        ? {
            width: '100%',
            height: '100%',
            position: 'relative'
          }
        : {
            width: this.size[0] + 'px',
            height: this.size[1] + 'px',
            position: 'fixed'
          }
      }
    },
    mounted() {
      this.dragBox = this.$refs.dragBox
    },
    methods: {
      onMousedown (e) {
        this.dragging = this.draggable
        if (!this.dragging) return
        const { offsetLeft, offsetTop } = this.dragBox
        this.primartPosition = {
          x: e.clientX - offsetLeft,
          y: e.clientY - offsetTop
        }
        document.documentElement.addEventListener('mousemove', this.onMousemove)
        document.documentElement.addEventListener('mouseup', this.onMouseup)
      },
      onMouseup () {
        this.preventEvent = false
        this.dragging = false
        document.documentElement.removeEventListener('mousemove', this.onMousemove)
      },
      onMousemove (e) {
        this.preventEvent = true
        const { x, y } = this.primartPosition
        const moveStyle = {
          left: e.clientX - x,
          top: e.clientY - y
        }
        if (this.shake > 0) {
          if (Math.abs(moveStyle.left - this.shakePosition.x) >= this.shake) {
            this.shakePosition.x = moveStyle.left
          }
          if (Math.abs(moveStyle.top - this.shakePosition.y) >= this.shake) {
            this.shakePosition.y = moveStyle.top
          }
          this.dragBox.style.left = this.shakePosition.x + 'px'
          this.dragBox.style.top =this.shakePosition.y + 'px'
        } else {
          this.dragBox.style.left = moveStyle.left + 'px'
          this.dragBox.style.top = moveStyle.top + 'px'
        }
      }
    }
  }
</script>
<style>
  ._drag-box {
    box-shadow: 0 0 4px #cccccc;
    display: flex;
    flex-direction: column;
  }

  ._drag-box-content {
    flex-grow: 1;
    width: 100%;
    height: 0;
  }

  .prevent-event {
    pointer-events: none;
    user-select: none;
  }
</style>