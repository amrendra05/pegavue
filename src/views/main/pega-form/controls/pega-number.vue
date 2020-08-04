<template>
  <el-input-number :value="value" :controls="false" :disabled="field.disabled" :placeholder="placeholder" :precision="precision" @change="handleChange" />
</template>

<script>
export default {
  name: 'pega-number',
  props: ['field', 'value', 'handleChange'],
  computed: {
    mode() {
      return this.field.control.modes[1]
    },
    placeholder() {
      // Have tooltip display as a placeholder
      const mode = this.mode
      return mode && mode.tooltip ? getPropertyValue(mode.tooltip) : null
    },
    precision() {
      const mode = this.mode
      let dp = mode && mode.decimalPlaces ? parseInt(getPropertyValue(mode.decimalPlaces),10) : 0
      return (dp >= 0 ? dp : null)
    }
  }
}
</script>

<style scoped>
</style>
