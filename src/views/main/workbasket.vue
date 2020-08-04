<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between" class="header-row">
        <el-col :span="16">
          <span v-if="!hasWorkqueues" class="heading">
            <h1 class="title">{{ title }}</h1>
          </span>
          <el-select v-else :value="wbValue" @change="handleWBChange">
            <el-option key="worklist" value="worklist" :label="title" />
            <el-option
              v-for="entry in work.workqueues"
              :key="entry"
              :value="entry"
              :label="entry"
            />
          </el-select>
        </el-col>
        <el-col :span="4" class="action-col">
          <el-button @click="handleWBRefresh">Refresh</el-button>
        </el-col>
      </el-row>
    </el-header>
    <div class="table-container">
      <el-table
        :data="worklist"
        stripe
        border
        style="width: 100%"
        @row-click="(row, event, col) => openWorkObject(row, event, col)"
        v-loading="loading"
        >
        <el-table-column
          prop="pxRefObjectInsName"
          label="Case">
        </el-table-column>
        <el-table-column
          prop="pyAssignmentStatus"
          label="Status">
        </el-table-column>
        <el-table-column
          prop="pyLabel"
          label="Category">
        </el-table-column>
        <el-table-column
          prop="pxUrgencyAssign"
          label="Urgency">
        </el-table-column>
      </el-table>
      <el-pagination class="table-footer"
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="work.worklist.length"
          @current-change="changePage">
      </el-pagination>
    </div>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'workbasket',
  computed: {
    ...mapGetters({
      work: 'work'
    }),
    hasWorkqueues() {
      return this.work.workqueues.length > 0
    },
    wbValue() {
      return this.work.activeWorkqueue
    },
    worklist() {
      const end = this.curPage * this.pageSize
      const start = end - this.pageSize
      return this.work.worklist.slice(start, end)
    }
  },
  methods: {
    handleWBChange(value) {
      this.loading = true
      if( value === "worklist" ) {
        this.$store.dispatch('getWorklist')
          .then(() => {
            this.loading = false
          })
      } else {
        this.$store.dispatch('getWorkBasket', value)
          .then(() => {
            this.loading = false
          })
      }
    },
    handleWBRefresh() {
      this.loading = true
      if( this.hasWorkqueues ) {
        this.$store.dispatch('getWorkBasket', this.wbValue )
          .then(() => {
            this.loading = false
          })
      } else {
        this.$store.dispatch('getWorklist')
          .then(() => {
            this.loading = false
          })
      }
      //No need to force an update
      //this.$forceUpdate()
    },
    openWorkObject: function (row, event, col) {
      const caseID = row.pxRefObjectKey;
      const assignmentID = row.pzInsKey;

      this.$store.dispatch('getCase', caseID)
      this.$store.dispatch('getAssignment', { id: assignmentID })
      this.$store.dispatch('addOpenCase', caseID)
      this.$store.dispatch('changeActiveTab', caseID)
    },
    changePage(page) {
      this.curPage = page
    }
  },
  created () {
    this.$store.dispatch('getWorklist')
      .then(() => {
        this.loading = false
      })
  },
  data() {
    return {
      title: "My Work",
      loading: true,
      curPage: 1,
      pageSize: 15
    }
  },
}
</script>

<style scoped>
  .table-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    height: 90%;
    margin: 1rem 1.5rem;
    border-radius: .5rem;
    color: #fff;
    text-align: center;
  }

  .table-footer {
    border: 1px solid #ebeef5;
    border-radius: 0 0 .5rem .5rem;
  }

  h2 {
    font-size: 4.5rem;
    font-weight: 300;
    line-height: 1.1;
  }

  p {
    font-size: 1.5rem;
  }
</style>
