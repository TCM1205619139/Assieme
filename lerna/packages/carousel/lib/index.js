import Carousel from './Carousel.vue'

Reflect.set(Carousel, 'install', function (Vue) {
  Vue.component(Carousel.name, Carousel);
})

export default Carousel
