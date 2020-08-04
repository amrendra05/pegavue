<template>
  <el-date-picker
    :value="date" 
    type="date"
    :disabled="field.disabled"
    :format="format" 
    @input="(value) => handleChange(convertDate(value))" 
    suffix-icon="el-icon-date"
  />
</template>

<script>
// TODO: Determine when to leverage el-datetime-picker (once there is a way to determine if
//  field is meant to be a date or datetime field)
import moment from 'moment'

export default {
  name: 'pega-datetime',
  props: ['field', 'value', 'handleChange'],
  computed: {
    date() {
      return this.value ? moment(this.value) : null;
    },
    format(){
      let sReturnFormat = "";
      let dateTimeFormat = this.field.control.modes[1].dateTimeFormat;
      switch(dateTimeFormat) {
        case "DateTime-Short":
          // 1/1/01 1:00 AM
        case "Date-Short":
          // 1/1/01
          sReturnFormat = "M/d/yy"
          break
        case 'DateTime-Short-Custom':
          // 01/01/01 01:00 AM
        case "Date-Short-Custom":
          // 01/01/01
          sReturnFormat = "MM/dd/yy"
          break
        case "DateTime-DayMonthYear-Custom":
          // 01-Jan-2001 1:00:00 AM
        case "Date-DayMonthYear-Custom":
          // 01-Jan-2001
          sReturnFormat = "dd-MMM-yyyy"
          break;
        case "DateTime-Medium":
          // Jan 1, 2001 1:00:00 AM
        case "Date-Medium":
          // Jan 1, 2001
          sReturnFormat = "MMM d, yyyy"
          break
        case "DateTime-Full":
          // Monday, January 1, 2001 1:00 AM EDT
        case "Date-Full":
          // Monday, January 1, 2001 (not emitting day of week for now)
        case "DateTime-Long":
          // January 1, 2001 1:00:00 AM
        case "Date-Long":
          // January 1, 2001
          sReturnFormat = "MMMM d, yyyy"
          break
        case "DateTime-ISO-8601":
          // 2001/01/01 1:00:00 AM     y/m/d
        case "Date-ISO-8601":
          // 2001/01/01 y/m/d
          sReturnFormat = "yyyy/MM/dd"
          break
        case "DateTime-Gregorian-1":
          // 01 January, 2001 1:00:00 AM
        case "Date-Gregorian-1":
          // 01 January, 2001
          sReturnFormat = "dd MMMM, yyyy"
          break
        case "DateTime-Gregorian-2":
          // January 01, 2001 1:00:00 AM
        case "Date-Gregorian-2":
          // January 01, 2001
          sReturnFormat = "MMMM dd, yyyy"
          break
        case "Date-Gregorian-3":
          // 2001, January 01
          sReturnFormat = "yyyy, MMMM dd"
          break
        case "DateTime-Short-YYYY-Custom":
          // 01/01/2001 01:00 AM
        case "Date-Short-Custom-YYYY":
          // 01/01/2001
          sReturnFormat = "MM/dd/yyyy"
          break
        case "DateTime-Short-YYYY":
          // 1/1/2001 1:00 AM
        case "Date-Short-YYYY":
          // 1/1/2001
        case "DateTime-Custom":
        default:
          sReturnFormat = "M/d/yyyy"
          break
      }
      return sReturnFormat
    }
  },
  methods: {
    convertDate(value) {
      return moment(value.toISOString()).format('YYYYMMDD')
    }
  }
}


</script>

<style scoped>
</style>
