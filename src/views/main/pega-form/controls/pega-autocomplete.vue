<template>
  <el-autocomplete
    :value="value"
    :fetch-suggestions="search"
    :placeholder="placeholder"
    :disabled="field.disabled"
    @select="handleSelect"
  />
</template>

<script>
import { DataService } from '../../../../services'
import { getPropertyValue } from '../../../../utils'

export default {
  name: 'pega-autocomplete',
  props: ['field', 'value', 'handleChange'],
  computed: {
    mode() {
      return this.field.control.modes[0]
    },
    placeholder() {
      const mode = this.mode
      return mode && mode.placeholder ? getPropertyValue(mode.placeholder) : this.field.label
    },
  },
  data() {
    return {
      options: []
    }
  },
  methods: {
    search(queryString, cb) {
      var options = this.options
      var results = queryString ? options.filter(this.createFilter(queryString)) : options;
      cb(results)
    },
    createFilter(queryString) {
      return (option) => {
        return (option.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      this.handleChange(item.key);
    },
    convertDataPageToOptions(data, key, value) {
      data.pxResults.forEach(result => {
        if (result[value]) {
          this.options.push({ 
            key: result[value],
            value: `${result[value]} (${result[key]})`
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
    }
  }

}
</script>

<style scoped>
</style>
