<template>
  <el-form :model="values" ref="pegaForm" label-position="top">
    <el-container>
      <el-header>
        <el-row type="flex" justify="space-between" class="header-row">
          <el-col :span="16" class="border-right">
            <el-steps :active="curStageIndex" finish-status="success" align-center>
              <el-step v-for="(stage, index) in stages" :key="index" :title="stage.name"></el-step>
            </el-steps>
          </el-col>
          <el-col :span="4" class="action-col">
            <el-dropdown trigger="click" @command="handleCaseAction">
              <span class="el-dropdown-link">
                Actions<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="refresh">
                  Refresh
                </el-dropdown-item>
                <el-dropdown-item v-for="(action, index) in localActions" :key="action.id" :command="action.id" :divided="index === 0">
                  {{ action.name }}
                </el-dropdown-item>
                <el-dropdown-item v-for="(action, index) in assignmentActions" :key="action.id" :command="action.id" :divided="index === 0">
                  {{ action.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-main v-loading="isLoading">
        <el-row v-if="hasStatus"><el-col><el-alert v-for="item in statusMessages" :key="item" :title="item" type="error" show-icon></el-alert></el-col></el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-container>
              <el-header>
                <h1>{{ header }}</h1>
              </el-header>
              <el-main>
                <pega-view :view="view" :id="id" />
              </el-main>
              <el-footer v-if="!showPage">
                <workobject-footer 
                  class="buttonbar" 
                  :id="id" 
                  :loading="isLoading" 
                  :performActionOnAssignment="performActionOnAssignment"
                  :saveWorkobject="saveWorkobject"
                  :closeWorkobject="closeWorkobject"
                  >
                </Workobject-footer>
              </el-footer>
            </el-container>
          </el-col>
          <el-col :span="8">
            <el-container>
              <el-header>
                <h1>Case Details</h1>
              </el-header>
              <el-main>
                <pega-view v-if="caseView" :view="caseView" :id="id" />
              </el-main>
            </el-container>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'

import PegaView from './pega-form/pega-view'
import WorkobjectFooter from './workobject-footer'

export default {
  name: 'workobject',
  props: ['title', 'id'],
  computed: {
    ...mapGetters({
      assignments: 'assignments',
      cases: 'cases'
    }),
    showPage() {
      return (this.cases.pages.hasOwnProperty(this.id))
    },
    showAction() {
      return (this.assignments.actions.hasOwnProperty(this.id))
    },
    statusMessages() {
      return this.assignments.errors[this.id]
   },
    hasStatus() {
      return (this.statusMessages && this.statusMessages.length > 0)
    },
    isLoading() {
      return (this.forceLoading || (!this.showPage && !this.showAction))
    },
    view() {
      if (this.showPage) {
        return this.cases.pages[this.id]
      } else if (this.showAction) {
        return this.assignments.actions[this.id].view
      }

      return null
    },
    header() {
      if (this.showPage) {
        return this.cases.pages[this.id].name
      } else if (this.showAction) {
        return this.assignments.actions[this.id].name
      }

      return null
    },
    caseView() {
      return this.cases.views[this.id]
    },
    values() {
      return this.assignments.values[this.id]
    },
    formRef() {
      return this.$refs.pegaForm
    },
    /**
     * Get local actions for assignment
     * @return { Array } Array of local action Dropdown Items
     */
    localActions() {
      let localActions = []
      const assignment = this.assignments.details[this.id]
      const curAction = this.assignments.actions[this.id]
      if (!assignment || !curAction) { 
        return localActions 
      }

      assignment.actions.forEach(action => {
        if (action.type === "Case" && action.ID !== curAction.actionID) {
          localActions.push({id: action.ID, name: action.name })
        }
      });

      return localActions;
    },
    /**
     * Get assignment actions
     * @return { Array } Array of assignmet action Dropdown Items
     */
    assignmentActions() {
      let assignmentActions = [];
      const assignment = this.assignments.details[this.id]
      const curAction = this.assignments.actions[this.id]

      if (!assignment || !curAction) {
        return assignmentActions
      }

      const actionID = curAction.actionID

      assignment.actions.forEach(action => {
        if (
          action.type === "Assignment" &&
          action.ID !== actionID
        ) {
          assignmentActions.push({id: action.ID, name: action.name })
        }
      });

      return assignmentActions;
    },
    stages() {
      const caseDetails = this.cases.details[this.id]

      return caseDetails ? caseDetails.stages : []
    },
    curStageIndex() {
      const caseDetails = this.cases.details[this.id]

      if (caseDetails) {
        return this.stages.findIndex((elem) => { return elem.ID === caseDetails.stage })
      }

      return -1
    }
  },
  data() {
    return {
      forceLoading: null
    }
  },
  methods: {
    setForceLoading(bool) {
      this.forceLoading = bool
    },
    performActionOnAssignment() {
      this.setForceLoading(true)

      // TODO: Fix bug where validation state is maintained between components after form submit
      this.$store.dispatch('resetValidationMessages', this.id)
      this.formRef.validate((valid) => {
        if (valid) {
          const { id, assignments } = this
          const assignmentID = assignments.details[id].ID
          const actionID = assignments.actions[id].actionID
          const values = assignments.values[id]

          this.formRef.clearValidate()
          this.$store.dispatch('performActionOnAssignment', { id, assignmentID, actionID, values })
            .then(response => {
              if (response && response.status && response.status !== 200) {
                this.setForceLoading(false)
              }
            })
        } else {
          this.setForceLoading(false)
          return false
        }
      })
    },
    saveWorkobject() {
      const id = this.id
      const etag = this.cases.details[id].etag

      this.$store.dispatch('saveCase', { id, etag, values: this.assignments.values[id]})
    },
    closeWorkobject() {
      this.$store.dispatch('removeOpenCase', this.id);
    },
    handleCaseAction(actionID) {
      if (actionID === "refresh") {
        const assignmentID = this.assignments.details[this.id].ID
        const curActionID = this.assignments.actions[this.id].actionID

        this.$store.dispatch('getCase', this.id)
        this.$store.dispatch('getAssignment', { id: assignmentID, actionID: curActionID })
      } else {
        this.$store.dispatch('getActionForAssignment', { assignment: this.assignments.details[this.id], actionID })
      }
    }
  },
  components: {
    PegaView,
    WorkobjectFooter
  },
  created () {
    this.$store.watch(
      (state) => {
        return state.assignments.actions[this.id]
      },
      (newAction, oldAction) => {
        if (oldAction !== newAction && newAction) {
          this.setForceLoading(false)
          this.$store.dispatch('setInitialFormValues', { id: this.id, view: newAction.view })
        }
      }
    )

    this.$store.watch(
      (state) => {
        return state.cases.pages[this.id]
      },
      (newPage, oldPage) => {
        if (oldPage !== newPage && newPage) {
          this.setForceLoading(false)
          this.$store.dispatch('setInitialFormValues', { id: this.id, view: newPage })
        }
      }
    )
  },
}
</script>

<style scoped>
  .el-container {
    border: 1px solid #eee;
  }
  .el-main, .el-footer {
    border-top: 1px solid #eee;
  }
  .buttonbar {
    margin-top: .5rem;
  }
  .el-dropdown-link {
    cursor: pointer;
  }
  .action-col {
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid #eee;
  }
  .border-right {
    border-right: 1px solid #eee;
  }
  .border-left {
    border-left: 1px solid #eee;
  }
  .header-row {
    height: 60px;
  }
  h1 {
    text-align: center;
    font-size: 1.2em;
  }
</style>
