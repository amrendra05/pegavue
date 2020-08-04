<template>
  <el-input :value="value" :disabled="field.disabled" :placeholder="placeholder" @change="handleChange" type="number"/>
</template>

<script>
import { getPropertyValue } from '../../../../utils'

export default {
  name: 'pega-currency',
  props: ['field', 'value', 'handleChange'],
  computed: {
    mode() {
      return this.field.control.modes[0]
    },
    placeholder() {
      // Have tooltip display as a placeholder
      const mode = this.mode
      return mode && mode.tooltip ? getPropertyValue(mode.tooltip) : null
    }
  }
}
</script>

<style scoped>
</style>
