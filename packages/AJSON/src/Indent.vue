<template>
    <span v-if="this.indents.length !== 0">
        <span class="indent" v-for="(item, key) in indents" :key="key">
        </span>
    </span>
</template>

<script>
  export default {
    name: 'Indent',
    props: {
        indent: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            indents: []
        }
    },
    created() {
        this.indents = new Array(this.indent).fill(0)
    }
  }
</script>
<style lang="css" scoped>
    .indent {
        width: 3px;
        display: inline-block;
    }    
</style>