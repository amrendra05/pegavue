<template>
  <div :class="disabledClass">
    {{ formattedValue }}
  </div>
</template>

<script>
import { getDispTextValue } from '../../../../utils'
import moment from "moment"

export default {
  name: 'pega-displaytext',
  props: ['field', 'value'],
  computed: {
    mode() {
      return this.field.control.modes[1]
    },
    formattedValue() {
      return getDispTextValue(this.value, this.mode)
    },
    disabledClass() {
      return this.field.disabled ? "disabledDiv" : null
    }
  }
}
</script>

<style scoped>
.disabledDiv {
  opacity: 0.4
}
</style>
