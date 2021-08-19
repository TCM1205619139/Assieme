<script>
  import CodeRow from './CodeRow.vue'
  import Indent from './Indent.vue'

  export default {
    name: "CodeBlock",
    components: {
      CodeRow,
      Indent
    },
    props: {
      data: { // 传入需要渲染成JSON的对象
        required: true
      },
      indent: { // 需要缩进几个字符
        type: Number,
        required: true
      },
      dataKey: {  // 传入的data对象的键
        type: String,
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
    data() {
      return {
        block: {},
        row: {},
        isSpread: true
      }
    },
    render(createElement) {
      const keys = Object.keys(this.data)
      const values = Object.values(this.data)
      const icon = createElement('i', {
        class: {
          'fa': true,
          'fa-angle-right': true,
          'spread-icon': this.isSpread,
          'fold-icon': !this.isSpread
        },
        attrs: {
          'aria-hidden': 'true'
        },
        on: {
          click: this.iconClick
        },
      })
      const prefix = createElement('div', {
        class: 'prefix',
      }, [
        icon,
        createElement('indent', {props: {indent: this.indent > 0 ? this.indent - 1 : this.indent}}),
        (() => {
          if (this.dataKey) return createElement('span', {
            style: {
              'font-size': '12px',
              'padding-right': '2px',
              'color': 'rgb(172, 44, 44)'
            }
          }, this.parseDataKey)
        })(),
        createElement('span', {style: {transform: 'translateX(0px)', display: 'inline-block'}}, [
          '{',
          createElement('span', { class: {'ellipsis-show': !this.isSpread, 'ellipsis-hidden': this.isSpread } }, '...')
        ])
      ])
      const suffix = createElement('div', {
        class: 'suffix'
      }, [
        createElement('indent', {props: {indent: this.indent}}),
        createElement('span', {}, this.isLast ? '}' : '},')
      ])

      const vNodeChildren
       = values
      .map((value, index) => {
        if (value instanceof Object) {
          return createElement('code-block', {
            props: {
              indent: this.indent+this.tap,
              tap: this.tap,
              data: value,
              dataKey: keys[index],
              isLast: index === values.length - 1
            },
            class: {
              'content-show': this.isSpread,
              'content-hidden': !this.isSpread
            }
          })
        }
        return createElement('code-row', {
          props: {
            indent: this.indent,
            tap: this.tap,
            dataKey: keys[index],
            dataValue: value,
            isLast: index === values.length - 1
          },
          class: {
            'content-show': this.isSpread,
            'content-hidden': !this.isSpread
          }
        })
      })

      return createElement('div', {'class': 'container'},
        [
          prefix,
          ...vNodeChildren,
          suffix
        ]
      )
    },
    methods: {
      iconClick(e) {
        Object
        .values(e.target.classList)
        .findIndex(item => item === 'spread-icon')
        === -1
        ? this.isSpread = true
        : this.isSpread = false
      }
    },
    computed: {
      parseDataKey() {
        return '"' + this.dataKey + '": '
      }
    }
  }
</script>

<style scoped>
/* @import url('../../../assets/icon/css/font-awesome.min.css'); */
.prefix,.suffix {
  font-size: 13px;
  color: rgb(88, 28, 28);
  height: 18px;
  padding: 2px 0 0 0; 
}
.fold-icon {
  transform: translate(-12px, 0) scale(1.3) rotate(90deg);
  transition: all .2s;
}
.spread-icon {
  transform: translate(-12px) scale(1.3) rotate(0deg);
  transition: all .2s;
}
.content-hidden {
  display: none;
}
.content-show {
  /* line-height: 16px; */
  padding: 0;
  box-sizing: border-box;
}
.ellipsis-show {
  display: inline-block;
  transform: translateY(-3px);
  padding-left: 2px;
}
.ellipsis-hidden {
  display: none;
}
</style>