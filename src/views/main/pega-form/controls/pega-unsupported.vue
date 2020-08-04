<template>
  <div class="heading">
    <h1 class="title">{{ field.control.type }} not yet supported.</h1>
    <h2>It contains a value of {{ value }}.</h2>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'pega-unsupported',
  props: ['field', 'value'],
}
</script>

<style scoped>
</style>
