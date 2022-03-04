import Carousel from './src'

Carousel.install = function (Vue) {
  Vue.component(Carousel.name, Carousel)
}

export default Carousel