<template>
  <div>
    <el-header v-if="layout.title">
      <h1 class="title">{{ layout.title }}</h1>
    </el-header>
    <pega-grid v-if="layout.groupFormat === 'Grid'" :grid="layout" :id="id"></pega-grid>
    <pega-view v-else-if="layout.view" :view="layout.view" :id="id"></pega-view>
    <el-row v-else :gutter="20">
      <el-col v-for="(group, index) in layout.groups" :key="index" :span="spanWidths[index]">
        <pega-group :group="group" :id="id"></pega-group>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'pega-layout',
  props: ['layout', 'id'],
  computed: { 
    spanWidths() {
      const { groups } = this.layout;

      switch (this.layout.groupFormat) {
        case 'Inline grid triple': { return [8, 8, 8] }
        case 'Inline grid double': { return [12, 12] }
        case 'Inline grid 70 30': { return [16, 8] }
        case 'Inline grid 30 70': { return [8, 16] }
        case 'Stacked': { return groups.map((x) => { return 24 }) }
        case 'Inline middle': { return Array(groups.length).map((x) => { return Math.floor(24/groups.length) }) }
        default: { return groups.map((x) => { return 24 }) }
      }
    }
  },
  components: {
    PegaGroup: () => import('./pega-group'),
    PegaView: () => import('./pega-view'),
    PegaGrid: () => import('./pega-grid')
  },
  methods: { },
  created () { 
  },
  data() {
    return { }
  },
}
</script>

<style scoped>
  .el-header {
    text-align:center;
  }
</style>
