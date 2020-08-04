<template>
  <component :is="child" v-bind="group" :id="id"></component>
</template>

<script>
import { mapGetters } from 'vuex'

import PegaLayout from './pega-layout'
import PegaParagraph from './pega-paragraph'
import PegaCaption from './pega-caption'
import PegaField from './pega-field'

export default {
  name: 'pega-group',
  props: ['group', 'id'],
  components: {
    // this dynamic import is needed because of circular dep, View > Group > View
    // https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
    PegaView: () => import('./pega-view'),
    PegaLayout,
    PegaParagraph,
    PegaCaption,
    PegaField
  },
  computed: { 
    child() {
      const { group } = this;
      if (group.view) { return 'PegaView' }
      if (group.layout) { return 'PegaLayout' }
      if (group.paragraph) { return 'PegaParagraph' }
      if (group.caption) { return 'PegaCaption' }
      if (group.field) { return 'PegaField' }
      return null;
    }
  },
  methods: { },
  created () { 
  },
  data() {
    return { }
  },
}
</script>

<style scoped>
</style>
