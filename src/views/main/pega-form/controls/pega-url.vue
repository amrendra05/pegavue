<template>
  <el-input :value="value" :disabled="field.disabled" @change="handleChange" />
</template>

<script>
export default {
  name: 'pega-url',
  props: ['field', 'value', 'handleChange'],
}
</script>

<style scoped>
</style>
