<template>
  <div>
    <el-container>
      <el-header>
        <h1 v-if="casetype" class="title">New {{ casetype.name }}</h1>
      </el-header>
      <el-main v-loading="!casetype || !cases.creationPages[casetype.ID]">
        <div v-if="casetype && cases.creationPages[casetype.ID]">
          <el-form>
            <pega-view :view="cases.creationPages[casetype.ID]" :id="casetype.ID" />
          </el-form>
        </div>
      </el-main>
      <el-footer>
        <el-button-group class="right">
          <el-button type="danger" @click="cancelCaseCreation" >Cancel</el-button>
          <el-button @click="createCaseWithValues" >Submit</el-button>
        </el-button-group>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import PegaView from './pega-form/pega-view'

export default {
  name: 'add',
  data() {
    return { 
      title: "Case",
      type: null,
    }
  },
  components: {
    PegaView
  },
  computed: {
    ...mapGetters({
      cases: 'cases',
      assignments: 'assignments'
    }),
    casetype() {
      return this.$store.getters.cases.types.find( (type) => {
        return type.ID === this.$route.params.type
      })
    }
  },
  methods: { 
    handleCaseCreation(id, casetypes) {
      if (this.casetype.startingProcesses[0].requiresFieldsToCreate === 'true') {
        this.$store.dispatch('getCaseCreationPage', this.$route.params.type)
          .then(res => {
            this.$store.dispatch('setInitialFormValues', { id: this.casetype.ID, view: res.creation_page })
          })
      }
    },
    createCaseWithValues() {
      const id = this.casetype.ID
      const values = this.assignments.values[id]

      this.$store.dispatch('createCase', { id: this.casetype.ID, content: values })
      this.$router.push({ name: 'workarea' })
    },
    cancelCaseCreation() {
      this.$router.push({ name: 'workarea' })
    }
  },
  created() {
    const { cases } = this
    const id = this.$route.params.type

    if (cases.types.length === 0) {
      this.$store.dispatch('getCasetypes')
        .then(res => {
          let test = this
          this.handleCaseCreation(id, this.cases.types)
        })
    } else {
      this.handleCaseCreation(id, this.cases.types)
    }
  },
  watch: {
    $route(to, from) {
      this.handleCaseCreation(this.$route.params.type, this.cases.types)
    }
  }
}
</script>

<style scoped>
  .el-container {
    border: 1px solid #eee;
  }
  .el-main, .el-footer {
    border-top: 1px solid #eee;
  }
  .right {
    float: right;
    margin-top: .5rem;
  }
</style>
