import CodePiece from './src/index.vue'

CodePiece.install = function (Vue) {
  Vue.component(CodePiece.name, CodePiece)
}

export default CodePiece