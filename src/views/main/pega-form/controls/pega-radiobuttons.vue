<template>
  <el-radio-group v-model="radioVal" @change="handleChange" :disabled="field.disabled">
    <el-radio
      v-for="option in mode.options" :key="option.key" :style="vertStyle"
        :label="option.key">{{option.value}}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'pega-radiobuttons',
  props: ['field', 'value', 'handleChange'],
  computed: {
    mode() {
      return this.field.control.modes[0]
    },
    vertStyle() {
      const mode = this.mode
      // needed to speciy margin-left to avoid non-first radio butons being padded and pushed right by 30px
      return (mode && mode.orientation == "vertical") ? "display:block;margin-left:0px" : ""
    }
  },
  data() {
    return {
      radioVal: this.value
    }
  }
}
</script>

<style scoped>
</style>
