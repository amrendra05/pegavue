<template>
  <el-container>
    <el-main>
      <el-table
        border
        stripe
        v-loading="loading"
        :data="grid.rows"
        style="width: 100%">
        <el-table-column
          v-for="(group, index) in grid.header.groups"
          :key="index"
        >
          <template slot="header" slot-scope="scope">
            <pega-group :group="group" :id="id" :test="scope"></pega-group>
          </template>
          <template slot-scope="scope">
            <pega-group :group="scope.row.groups[index]" :id="id"></pega-group>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-button-group class="left">
        <el-button @click="() => handleGridAction(true)" type="primary" :disabled="loading">Add Row</el-button>
        <el-button @click="() => handleGridAction(false)" type="danger" :disabled="loading">Delete Row</el-button>
      </el-button-group>
    </el-footer>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'

import PegaGroup from './pega-group'
import { ReferenceHelper } from '../../../utils'

export default {
  name: 'pega-grid',
  props: ['grid', 'id'],
  computed: { 
    ...mapGetters({
      assignments: 'assignments',
      cases: 'cases'
    }),
    isPageGroup() {
      return this.grid.referenceType === "Group"
    }
  },
  methods: { 
    handleGridAction(isAdd) {
      this.loading = true

      const { id, assignments } = this
      const assignmentID = assignments.details[id].ID
      const actionID = assignments.actions[id].actionID

      let content = ReferenceHelper.getPostContent(assignments.values[id])
      let target = ReferenceHelper.getRepeatFromReference(
        this.grid.reference,
        this.grid.referenceType,
        content
      )
      
      if (this.isPageGroup) {
        const key = isAdd
          ? prompt('Please enter a name for the group.', '')
          : prompt('Please enter the name of the group to be deleted.')

        if (!key) { return }

        if (isAdd) {
          target[key] = {};
        } else {
          delete target[key];
        }
      } else {
        if (isAdd) {
          target.push(ReferenceHelper.getBlankRowForRepeat(target))
        } else {
          if (target.length > 0) {
            target.pop()
          }
        }
      }

      this.$store.dispatch('performRefreshOnAssignment', { assignmentID, actionID, content })
        .then(response => {
          this.loading = false
        })
    },
    deleteRow() {

    }
  },
  created () { 
  },
  data() {
    return { 
      loading: false
    }
  },
  components: {
    PegaGroup,
  },
}
</script>

<style scoped>
</style>
