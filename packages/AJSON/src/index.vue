<template>
  <div class="c-container">
    <textarea
      spellcheck="false"
      class="str-container"
      v-model="textarea"
      @blur="parseObject"
      @keydown.tab="tabHandler"
    />
    <div class="obj-container">
      <code-block
        :data="jsonObject"
        :indent="indent"
        dataKey=""
        :tap="tap"
        :isLast="true"
      ></code-block>
    </div>
  </div>
</template>

<script>
  import CodeBlock from './CodeBlock.vue'
  import { string2Object } from './func'

  export default {
    name: "AJSON",
    components: {
      CodeBlock,
    },
    props: {
      data: {
        type: Object,
        required: false,
        default: () => {}
      }
    },
    data() {
      return {
        textarea: '',
        jsonObject: {},
        indent: 0,
        tap: 4
      }
    },
    methods: {
      parseObject() {
        if (this.textarea) {
          new Promise((resolve) => {
            const object = string2Object(this.textarea)

            resolve(object)
          })
          .then((data) => {
            this.jsonObject = data
          })
          .catch(e => {
            this.emitError(e)
          })
        } else {
          this.jsonObject = {}
        }
      },
      emitError(error) {
        console.error(error)
        this.$emit('on-error', error)
      },
      tabHandler(e) { // 按下tab进行文字缩进
        e.preventDefault();
        if(e.target) {
          const node = e.target
          const {selectionStart, selectionEnd} = node
          const length = node.value.length
          let startString = node.value.substr(0, selectionStart)
          let endString = node.value.substr(selectionStart, length)

          for(let i=0; i<this.tap; i++) {
            startString += ' '
          }

          node.value = startString + endString;
          node.selectionStart = selectionStart + 4;
          node.selectionEnd = selectionEnd + 4
        }
      }
    },
    watch: {
      jsonObject(newValue, oldValue) {  // 这里需要处理一下json对象解析错误的情况
        this.$emit('code-change', this.jsonObject)
      }
    }
  }
</script>

<style lang="css" scoped>
  * {
    padding: 0px;
    margin: 0px;
  }
  .c-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
  }
  .str-container {
    flex: 1;
    height: 100%;
    margin-right: 5px;
    border-radius: 5px;
    border: 1px solid rgb(233, 233, 233);
    background-color: rgb(233, 233, 233);
    font-size: 12px;
    caret-color: rgb(54, 54, 54);
    outline: none;
    resize: none;
  }
  .obj-container {
    flex: 1;
    height: 100%;
    margin-left: 5px;
    padding-left: 15px;
    border-radius: 5px;
    border: 1px solid rgb(233, 233, 233);
    background-color: rgb(233, 233, 233);
    overflow: auto;
  }
  .obj-container::-webkit-scrollbar,.str-container::-webkit-scrollbar {
    width: 3px;
  }
  /*定义滚动条轨道*/
  .obj-container::-webkit-scrollbar-track,.str-container::-webkit-scrollbar-track {
    border-radius: 5px;
  }
  /*定义滑块*/
  .obj-container::-webkit-scrollbar-thumb,.str-container::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(40, 43, 56, 0.5);
  }
</style>