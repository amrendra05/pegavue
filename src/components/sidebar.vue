<template>
  <aside class="sidebar" :class="{ collapse: isCollapsed }">
    <nav class="menu">
      <menu-list :items="menus" active-class/>
    </nav>
    <footer class="footer">
      <a class="toggle pi pi-move-left-solid" title="Toggle navigation menu" @click="toggleCollapse"></a>
      <a class="copyright">&copy; {{ copyright }}</a>
    </footer>
  </aside>
</template>

<script>
import { mapGetters } from 'vuex'
import MenuList from './menu'

export default {
  name: 'app-sidebar',
  components: { MenuList },
  computed: mapGetters({
    sidebar: 'sidebar'
  }),
  methods: {
    toggleCollapse() {
      this.$store.dispatch('toggleSidebarCollapse')
    }
  },
  created () {
    this.$store.dispatch('getCasetypes');
    this.$store.dispatch('getRecents');
  },
  computed: {
    isCollapsed() {
      return this.$store.state.sidebar.collapse;
    },
    menus() {
      let newChildren = [] 
      let homeChildren = [ { type: 'tab', text: 'Dashboard', name: 'workarea', params: { id: 'Dashboard'} } ]
      let recents = []
      
      this.$store.getters.cases.types.forEach((type) => {
        if (type.CanCreate === 'true') {
          if (type.startingProcesses[0].requiresFieldsToCreate === 'true') {
            newChildren.push({ type: 'create',  text: type.name, name: 'new', params: { type: type.ID, immediateCaseCreate: false } })
          } else {
            newChildren.push({ type: 'create', text: type.name, name: 'dashboard', params: { type: type.ID, immediateCaseCreate: true  }})
          }
        }
      })

      this.$store.getters.cases.recents.forEach((recent) => {
        recents.push({ type: 'recent', text: `${recent.pyLabel} | ${recent.pyRecordID}`, params: { id: recent.pyRecordKey } })
      })

      this.$store.getters.cases.open.forEach((openCase) => {
        homeChildren.push({ type: 'tab', text: openCase.split(' ')[1], params: { id: openCase } })
      })

      // for icon entries below "pi pi-" is preprended as constructing CSS classname
      return [
        {
          text: 'New',
          icon: 'document-plus-solid',
          children: newChildren
        },
        {
          text: 'Get next work',
          icon: 'forward-solid',
          type: 'GetNextWork'
        },
        {
          text: 'Home',
          icon: 'home-alt-solid',
          type: 'Dashboard',
          children: homeChildren
        },
        {
          divider: true
        },
        {
          text: 'Recents',
          icon: 'clipboard-data',
          children: recents
        }
      ]
    }
  },
  data() {
    return {
      copyright: 'PegaSystems',
    }
  }
}
</script>
