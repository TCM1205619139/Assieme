<template>
  <div class="container">
    <indent :indent="indent+tap" />
    <span class="key">"{{dataKey}}"</span>
    <span>: </span>
    <span class="value" v-html="formatValue"></span>
  </div>
</template>

<script>
  import Indent from './Indent.vue'

  export default {
    name: "CodeRow",
    components: {
      Indent
    },
    props: {
      dataKey: {
        type: String,
        required: true
      },
      dataValue: {
        required: true
      },
      indent: {
        type: Number,
        required: true
      },
      tap: {
        type: Number,
        required: true
      },
      isLast: {
        type: Boolean,
        required: true
      }
    },
    computed: {
      formatValue() {
        const comma = this.isLast ? '' : ','
        switch(typeof this.dataValue) {
          case 'string':
            return `<span class="kw-string">"${this.dataValue}"</span><span>${comma}</span>`
          case 'number':
            return `<span class="kw-number">${this.dataValue}</span></span><span>${comma}</span>`
          case 'undefined':
            return `<span class="kw-undefined">${this.dataValue}</span></span><span>${comma}</span>`
          case 'boolean':
            return `<span class="kw-boolean">${this.dataValue}</span></span><span>${comma}</span>`
          case 'object':  // typeof null = 'object'
            return `<span class="kw-null">${this.dataValue}</span></span><span>${comma}</span>`
        }
      }
    }
  }
</script>

<style scoped>
  .container {
    padding: 2px 0;
  }
  .container > span {
    font-size: 12px;
    line-height: 12px;
  }
  .container > .key {
    color: rgb(172, 44, 44);
  }
</style>
<style lang="css">
  .container span[class="kw-string"] {
    color: rgb(0, 138, 18);
  }
  .container span[class="kw-number"] {
    color: rgb(175, 6, 167);
  }
  .container span[class="kw-undefined"] {
    color: rgb(197, 0, 197);
  }
  .container span[class="kw-boolean"] {
    color: rgb(2, 66, 163);
  }
</style>