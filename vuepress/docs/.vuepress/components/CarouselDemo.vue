<script>
  import Carousel from '../../../../lerna/packages/carousel/dist/index'

  export default {
    name: 'CarouselDemo',
    components: {
      Carousel
    },
    data () {
      return {
        items1: new Array(10)
          .fill(0)
          .map(() => {
            return {
              width: '100px',
              height: `${this.randomTo(50, 200)}px`,
              backgroundColor: `${this.randomColor()}`
            }
          }),
        items2: new Array(10)
          .fill(0)
          .map(() => {
            return {
              height: '100px',
              width: `${this.randomTo(50, 200)}px`,
              backgroundColor: `${this.randomColor()}`
            }
          })
      }
    },
    mounted () {
      setTimeout(() => {
        this.items1.unshift({
          height: '100px',
          width: `${this.randomTo(50, 200)}px`,
          backgroundColor: `${this.randomColor()}`
        })
      }, 5e3)
    },
    methods: {
      randomTo(start, end) {
        return Math.floor(Math.random() * (end - start)) + start
      },
      randomColor () {
        return `#${this.randomTo(0, 255)}${this.randomTo(0, 255)}${this.randomTo(0, 255)}fff`.slice(0, 7)
      }
    }
  }
</script>

<template>
  <section class="carousel-demo-container">
    <carousel :speed="1" direction="vertical" :pauseTime="1e3" class="demo-vertical">
      <div v-for="(item, index) in items1" :key="index" :style="item"></div>
    </carousel>

    <carousel :speed="1" direction="horizontal" :pauseTime="1e3" class="demo-horizontal">
      <div v-for="(item, index) in items2" :key="index" :style="item"></div>
    </carousel>
  </section>
</template>

<style scoped>
.carousel-demo-container {
  width: 300px;
}

.demo-vertical {
  display: inline-block;
  width: auto;
  height: 350px;
}

.demo-horizontal {
  width: 350px;
  height: auto;
}
</style>
