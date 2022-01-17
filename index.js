import 'normalize.css'
import './assets/icon/css/font-awesome.min.css'
import AJSON from './packages/AJSON'
import Carousel from './packages/Carousel'
import DragBox from './packages/DragBox'

const COMPONENTS = [
  AJSON,
  Carousel,
  DragBox
]

const install =  function (Vue, options = {})  {
  COMPONENTS.forEach(component => {
    Vue.component(component.name, component)
  })
}

export default {
  install,
  AJSON,
  Carousel,
  DragBox
}
