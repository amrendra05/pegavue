<template>
  <div>
    <el-tabs :value="activeTab"  type="border-card" @tab-click="changeTab" @tab-remove="removeTab">
      <el-tab-pane
        v-for="(item) in openTabs"
        :key="item.id"
        :label="item.title"
        :name="item.id"
        :id="item.id"
        :closable="item.closable"
        :lazy="true"
      >
        <keep-alive>
          <component :is="item.component" v-bind="item" v-on:open-tab="openTab" ></component>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Workbasket from './workbasket'
import WorkObject from './workobject'

export default {
  name: 'workarea',
  components: {
    Workbasket,
    WorkObject
  },
  computed: {
    ...mapGetters({
      cases: 'cases',
    }),
    activeTab () {
      return this.cases.activeTab
    },
    openTabs () {
      const cases = this.$store.getters.cases;
      
      if (cases.open.length > 0) {
        return([...this.tabs, ...(cases.open.map((aCase) => { return { title: aCase.split(' ')[1], component: "WorkObject", id: aCase, closable: true } }))])
      }

      return this.tabs
    }
  },
  created () {
    this.$title('Dashboard')
    this.$store.watch(
      (state) => {
        return state.cases.open.length
      },
      (newLen, oldLen) => {
        // this should be the normal way that tab focus is changed
        // in the event that we open an already opened case from the worklist
        // then we will emit an 'open-tab' from the dashboard component
        const cases = this.$store.getters.cases
        if (newLen > 0) {
          if (newLen > oldLen) {
            // we have added a tab, open it
            // this.curTab = cases.open[cases.open.length - 1]
            this.$store.dispatch('changeActiveTab', cases.open[cases.open.length - 1]);
          } else {
            // we have removed a tab, find if we need to change focus
            if (cases.open.indexOf(this.activeTab) === -1) {
              // we have removed the active tab, fall back to dashboard
              this.$store.dispatch('changeActiveTab', 'Dashboard')
            }
          }
        } else {
          // cases.open.length === 0, reset to dashboard
          this.$store.dispatch('changeActiveTab', 'Dashboard')
        }
      }
    )
  },
  data() {
    return {
      tabs: [{
        title: 'Dashboard',
        component: 'Workbasket',
        id: 'Dashboard',
        closable: false
      }],
    }
  },
  methods: {
    removeTab(targetID) {
      this.$store.dispatch('removeOpenCase', targetID);
    },
    openTab(id) {
      if (this.activeTab !== id) {
        this.$store.dispatch('changeActiveTab', id)
        // this.curTab = id
      }
    },
    changeTab(tab) {
      this.$store.dispatch('changeActiveTab', tab.name)
    }
  }
}
</script>

<style scoped>
  .inner {
    height: calc(100% - 2rem);
  }

  .jumbotron {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    height: 90%;
    margin: 1rem 1.5rem;
    background-color: #475669;
    border-radius: .5rem;
    color: #fff;
    text-align: center;
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
