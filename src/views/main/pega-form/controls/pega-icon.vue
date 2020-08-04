<template>
  <i :class="iconClass" @click="handleChange" />
</template>

<script>
import { getImageClass } from '../../../../utils'

export default {
  // TODO: support events on icon click, orientation of icon label
  name: 'pega-icon',
  props: ['field', 'value', 'handleChange'],
  computed: {
    mode() {
      return this.field.control.modes[1]
    },
    iconClass() {
      return getImageClass( this.mode.iconSource,
        this.mode.iconStyle,
        this.mode.iconStandard)
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
