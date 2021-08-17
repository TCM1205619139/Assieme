import Carousel from './src/index'

Carousel.install = function (Vue) {
  Vue.component(Carousel.name, Carousel)
}

export default Carousel