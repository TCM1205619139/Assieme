<script>
  import Carousel from 'carousel'

  export default {
    name: 'CarouselDemoHorizontal',
    components: {
      Carousel
    },
    data () {
      return {
        items: new Array(10)
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
    <carousel :speed="1" direction="horizontal" :pauseTime="1.5e3" class="demo-vertical">
      <div v-for="(item, index) in items" :key="index" :style="item"></div>
    </carousel>
  </section>
</template>

<style scoped>
.carousel-demo-container {
  width: 300px;
  padding: 12px 0;
}

.demo-vertical {
  height: auto;
  width: 350px;
}
</style>
