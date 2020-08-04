<template>
  <div v-if="view && view.visible">
    <pega-group v-for="(group, index) in view.groups" :group="group" :id="id" :key="index"></pega-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import PegaGroup from './pega-group'

export default {
  name: 'pega-view',
  props: ['view', 'id'],
  components: {
    PegaGroup
  },
  computed: { 
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
