<template>
  <el-select v-if="mode" :value="value" :placeholder="placeholder" @change="handleChange" :disabled="field.disabled">
    <el-option
       v-for="option in options"
       :key="option.key"
       :value="option.value"
       :label="option.key"
     />
  </el-select>
</template>

<script>
import { getPropertyValue } from '../../../../utils'
import { DataService } from '../../../../services'

export default {
  name: 'pega-dropdown',
  props: ['field', 'value', 'handleChange'],
  computed: {
    mode() {
      return this.field.control.modes[0]
    },
    placeholder() {
      const mode = this.mode
      return mode && mode.placeholder ? getPropertyValue(mode.placeholder) : this.field.label
    }
  },
  data() {
    return {
      options: []
    }
  },
  methods: {
    convertDataPageToOptions(data, key, value) {
      data.pxResults.forEach(result => {
        if (result[value]) {
          this.options.push({ 
            key: result[key],
            value: result[value] 
          })
        }
      })
    }
  },
  created() {
    const { mode } = this;

    if (mode.listSource === "locallist") {
      this.options = mode.options
    } else if (mode.listSource === "datapage") {
      DataService.get(mode.dataPageID)
        .then(res => {
          this.convertDataPageToOptions(res.data, mode.dataPagePrompt, mode.dataPageValue)
        })
    } else if (mode.listSource === "pageList") {
      // TODO: support pagelist
    }
  }
}
</script>

<style scoped>
</style>
