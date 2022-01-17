import DragBox from './src/index.vue'

DragBox.install = function (Vue) {
  Vue.component(DragBox.name, DragBox)
}

export default DragBox