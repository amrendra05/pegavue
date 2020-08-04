<template>
  <el-form-item>
    <el-button-group class="left">
      <el-button @click="closeWorkobject" :disabled="loading">Cancel</el-button>
    </el-button-group>
    <el-button-group class="right" >
      <el-button @click="saveWorkobject" :disabled="loading">Save</el-button>
      <el-button type="primary" @click="performActionOnAssignment" :disabled="loading">Submit</el-button>
    </el-button-group>
  </el-form-item>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'workobject-footer',
  props: ['id', 'loading', 'performActionOnAssignment', 'closeWorkobject', 'saveWorkobject'],
  computed: mapGetters({
    assignments: 'assignments',
    cases: 'cases'
  }),
}
</script>

<style scoped>
  .left {
    float: left;
  }
  .right { 
    float: right; 
  }
</style>
