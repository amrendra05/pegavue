<template>
  <el-input 
    :value="value" 
    :disabled="field.disabled" 
    @change="handleChange" 
    type="textarea"
  />
</template>

<script>
export default {
  name: 'pega-textarea',
  props: ['field', 'value', 'handleChange'],
}
</script>

<style scoped>
</style>
