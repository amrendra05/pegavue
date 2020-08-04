<template>
  <span>
  <el-checkbox v-if="!labelOnLeft" :value="checked" :disabled="field.disabled" @change="handleChange" :label="label" />
  <label v-if="labelOnLeft"><span>{{label}}</span>&nbsp;
    <el-checkbox :value="checked" :disabled="field.disabled" @change="handleChange" />
  </label>
  </span>
</template>

<script>

export default {
  name: 'pega-checkbox',
  props: ['field', 'value', 'handleChange'],
  computed: {
    checked() {
      return (this.value === true || this.value === 'true')
    },
    mode() {
      return this.field.control.modes[0]
    },
    labelOnLeft() {
      return (this.mode.captionPosition === 'left')
    },
    label() {
      return (this.field.control.label ? this.field.control.label : null)
    }
  },
  components: {
  },
  created() {
  }
}
</script>

<style scoped>
</style>
