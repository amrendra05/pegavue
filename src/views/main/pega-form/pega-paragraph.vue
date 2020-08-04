<template>
  <div v-if="paragraph.visible" v-html="paragraph.value">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'pega-paragraph',
  props: ['paragraph'],
}
</script>

<style scoped>
</style>
