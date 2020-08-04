<template>
  <el-input-number :value="value" controls-position="right" :precision="0" :disabled="field.disabled" @change="handleChange" />
</template>

<script>
export default {
  name: 'pega-integer',
  props: ['field', 'value', 'handleChange'],
}
</script>

<style scoped>
</style>
