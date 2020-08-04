<template>
  <ul class="list">
    <template v-for="(item, i) in items">
      <li class="divider" v-if="item.divider" :key="i"></li>
      <li class="title" v-else-if="item.title" :key="i">{{ item.title }}</li>
      <li class="item" v-else :class="{ active: activeClass && isActive(item) }" :key="i" @click="handleClick(item)">
        <router-link :to="item" :title="item.text"><i :class="'pi pi-' + item.icon" />{{ item.text }}</router-link>
        <ul class="list" v-if="item.children">
          <template v-for="(sub, s) in item.children">
            <li class="divider" v-if="sub.divider" :key="s"></li>
            <li class="item" v-else-if="sub.type === 'create' && sub.params.immediateCaseCreate" @click="createCaseImmediate(sub.params.type)" :key="s"><a class="sidebar-link">{{ sub.text }}</a></li>
            <li class="item" v-else-if="sub.type === 'create' && !sub.params.immediateCaseCreate" :class="{ active: activeClass && isActive(sub) }" :key="s"><router-link :to="sub" :title="sub.text">{{ sub.text }}</router-link></li>
            <li class="item" v-else-if="sub.type === 'recent'" @click="openRecent(sub.params.id)" :key="s"><a class="sidebar-link">{{ sub.text }}</a></li>
            <li class="item" v-else-if="sub.type === 'tab'" @click="switchToTab(sub.params.id)" :class="{ active: activeClass && isActive(sub) }" :key="s"><a class="sidebar-link">{{ sub.text }}</a></li>
          </template>
        </ul>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: 'menu-list',
  props: {
    items: Array,
    activeClass: Boolean
  },
  methods: {
    isActive (route) {
      if (this.$route.name === "workarea") {
        if (route.type === "tab") {
          return route.params.id === this.$store.getters.cases.activeTab
        }
      }
      const objectEqual = (a, b) => (Object.keys(a).length !== Object.keys(b).length) || Object.keys(a).every(key => String(a[key]) === String(b[key]))
      const routeEqual = item => item.name === this.$route.name && (!item.params || objectEqual(item.params, this.$route.params))
      return routeEqual(route) || (route.children && route.children.length && route.children.some(item => routeEqual(item)))
    },
    createCaseImmediate(type) {
      this.$router.push({ name: 'workarea' })
      this.$store.dispatch('createCase', { id: type })
    },
    openRecent(id) {
      this.$router.push({ name: 'workarea' })
      this.$store.dispatch('getCase', id)
        .then(
          (res) => {
            if( !res ) {
              alert("Unable to open case (null response)")
              return
            }
            if(res.hasOwnProperty("assignments") && res.assignments.length > 0) {
              this.$store.dispatch('getAssignment', { id: res.assignments[0].ID })
            } else {
              //No assignments...so display the Review harness (page)
              this.$store.dispatch('getPage', { id:id, pageID:"Review" })
            }
          },
          (error) => {
            //TODO: put message into open case area and don't close the case
            alert("Unable to open case (error response)")
            this.$store.dispatch('removeOpenCase', id);
            return
          }
        )
        .catch((err) => {
          //TODO: put message into open case area and don't close the case
           alert("unable to open case");
          this.$store.dispatch('removeOpenCase', id);
          return;
        })
      this.$store.dispatch('addOpenCase', id)
      this.$store.dispatch('changeActiveTab', id)
    },
    switchToTab(id) {
      this.$router.push({ name: 'workarea' })
      this.$store.dispatch('changeActiveTab', id)
    },
    getNextWork() {
      this.$router.push({ name: 'workarea' })
      this.$store.dispatch('getNextWork')
        .then((res) => {
          const {caseID, ID} = res;
          if(caseID) {
            this.$store.dispatch('getCase', caseID )
            if( ID ) {
              this.$store.dispatch('getAssignment', {id: ID})
              this.$store.dispatch('addOpenCase', caseID)
              this.$store.dispatch('changeActiveTab', caseID)
            }           
          }
       })
    },
    handleClick(item) {
      // Handle special types
      switch( item.type ) {
        case 'Dashboard':
          this.switchToTab("Dashboard")
          break
        case 'GetNextWork':
          this.getNextWork()
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped>
  .sidebar-link {
    cursor: pointer;
  }
</style>
