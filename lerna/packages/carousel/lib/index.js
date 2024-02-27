const Carousel = require('./Carousel.vue')

Reflect.set(Carousel, 'install', function (Vue) {
  Vue.component(Carousel.name, Carousel);
})

module.exports = Carousel
