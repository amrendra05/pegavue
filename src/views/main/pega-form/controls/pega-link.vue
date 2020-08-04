<template>
  <a @click="handleChange">
    <i v-if="linkIconOnLeft" :class="linkIconClass" />
    {{ field.control.label }}
    <i v-if="linkIconOnRight" style="padding-left:1em" :class="linkIconClass" />
  </a>
</template>

<script>
import { getImageClass } from '../../../../utils'

export default {
  name: 'pega-link',
  props: ['field', 'value', 'handleChange'],
  computed: {
    mode() {
      return this.field.control.modes[1]
    },
    linkIconClass() {
      return getImageClass( this.mode.linkImageSource,
        this.mode.linkStyle,
        this.mode.linkStandard)
   },
    linkIconOnLeft() {
      return ((this.mode.linkImageSource && this.mode.linkImageSource != "none") &&
        (this.linkIconClass != "" && this.mode.linkImagePosition == "left"))
    },
    linkIconOnRight() {
      return ((this.mode.linkImageSource && this.mode.linkImageSource != "none") &&
        (this.linkIconClass != "" && this.mode.linkImagePosition == "right"))
    }
  },
  created() {
  }
}
</script>

<style scoped>
</style>
