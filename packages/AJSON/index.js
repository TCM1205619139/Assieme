import AJSON from './src/index.vue'

AJSON.install = function (Vue) {
  Vue.component(AJSON.name, AJSON)
}

export default AJSON