<template>
  <el-button :disabled="field.disabled" @click="handleChange">{{ field.control.label }}</el-button>
</template>

<script>
export default {
  name: 'pega-button',
  props: ['field', 'value', 'handleChange'],
}
</script>

<style scoped>
</style>
