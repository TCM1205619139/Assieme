import 'normalize.css'
import './assets/icon/css/font-awesome.min.css'
import Button from './packages/Button/index'
import CodePiece from './packages/CodePiece/index'

const Assieme = {}
const COMPONENTS = [
  Button,
  CodePiece
]

Assieme.install = function (Vue, options = {}) {
  // if (options.components) {
  //   // 按需加载
  //   const componentNames = options.components

  //   componentNames.forEach(name => {
  //     COMPONENTS.forEach(component => {
  //       if (component.name === name) {
  //         Vue.component(component.name, component)
  //       }
  //     })
  //   })
  // } else {
    COMPONENTS.forEach(component => {
      Vue.component(component.name, component)
    })
  // }
}

export default Assieme