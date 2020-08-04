<template>
  <header class="header">
    <a class="toggle pi pi-bars" title="Toggle navigation menu" @click="toggleSidebar"></a>
    <h1 class="brand">
      <router-link to="/">{{ name }}</router-link>
    </h1>
    <span class="version">{{version}}</span>
    <nav class="toolbar">
      <ul class="list">
       <li class="item">
          <a href="#" v-if="session.name">Hi, {{ session.name}}! <i class="el-icon-info"></i></a>
          <ul class="list">
            <li class="item"><a href="#" @click.prevent="logout">Logout</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app-header',

  computed: mapGetters({
    session: 'session'
  }),

  created () {
    this.$store.dispatch('getCurrentUserData');
  },

  methods: {
    logout () {
      this.$store.dispatch('logout')
      this.$router.replace({ path: '/login' })
    },
    toggleSidebar () {
      this.$store.dispatch('toggleSidebarCollapse')
    }
  },

  data() {
    return {
      name: 'Pega Vue Starter Pack',
      version: 'v1.10'
    }
  }
}
</script>

<style scoped>
  .version {
    padding-top: .5rem;
    font-size: 0.8rem;
    vertical-align: baseline;
  }
</style>
