<template>
  <section class="login">
    <header class="login-header">
      <h1 class="brand"><router-link to="/" tabindex="-1">PegaVue</router-link></h1>
      <el-alert v-if="error" :title="error.title" type="warning" :description="error.message" show-icon/>
    </header>
    <el-form class="login-form" auto-complete="off" :model="model" :rules="rules" ref="login-form" label-position="top" @submit.native.prevent="handleSubmit">
      <h2 class="heading">Sign-in</h2>
      <el-form-item label="Login" prop="username" :required="true">
        <el-input type="text" v-model="model.username" placeholder="Please enter username"/>
      </el-form-item>
      <el-form-item label="Password" prop="password" :required="true">
        <el-input type="password" v-model="model.password" placeholder="Please enter password"/>
      </el-form-item>
      <el-button type="primary" native-type="submit" :loading="loading" @click="handleSubmit('login-form')">{{ loading ? 'Loading...' : 'Login' }}</el-button>
    </el-form>
  </section>
</template>

<script>
// https://github.com/auth0-blog/vue-jwt-authentication
// https://auth0.com/blog/build-an-app-with-vuejs/

export default {
  name: 'login',

  title: 'Pega Vue Starter Pack',

  data () {
    const model = {
      username: '',
      password: ''
    }

    // form validate rules
    const rules = {
      username: [
        { required: true, message: 'Username is required.' },
        { min: 1, max: 64, message: 'Username must be between 1 and 64 characters.' }
      ],
      password: [
        { required: true, message: 'Password is required.' },
        { min: 1, max: 64, message: 'Password must be between 1 and 64 characters.' }
      ]
    }

    return { model: model, rules: rules, error: null, loading: false }
  },

  methods: {
    handleSubmit (ref) {
    
      if( ref != "login-form" ) {
        return false
      }
    
      // form validate
      this.$refs[ref].validate(valid => {
        if (!valid) return false

        // validated
        this.error = null
        this.loading = true

        // create token from remote
        this.$store.dispatch('login', this.model)
          .then(success => {
            this.$router.replace({ path: this.$route.query.redirect || '/' })
            this.loading = false
          })
          .catch(err => {
            this.error = { title: 'Login failed', message: 'Login failed!' }
            switch (err.response && err.response.status) {
              case 401:
                this.error.message = '401'
                break
              case 500:
                this.error.message = '500'
                break
            }
            this.loading = false
          })
      })
    }
  }
}   

</script>

<style lang="scss">
  @import '../assets/styles/base/variables';

  .login {
    flex: 1;
    width: 95%;
    max-width: 22rem;
    margin: 0 auto;
    font-size: .875rem;

    &-header {
      margin-bottom: 1rem;

      .brand {
        margin: 4.5rem 0 3.5rem;
        text-align: center;
        letter-spacing: .125rem;

        a {
          margin: 0;
          color: $brand-color;
          font: 300 3rem sans-serif;

          &:hover {
            color: $brand-hover-color;
            text-shadow: 0 0 1rem $brand-hover-color;
          }
        }
      }
    }

    &-form {
      margin-bottom: 2.5rem;
      padding: 1.875rem 1.25rem;
      background: $login-form-background;
      color: $login-form-color;

      .heading {
        margin: 0 0 1rem;
        font-weight: 400;
        font-size: 1.5rem;
      }

      .el-button {
        margin-top: .5rem;
        width: 100%;
      }
    }

    &-footer {
      margin-bottom: 1rem;
      padding: .625rem;
      border: .0625rem solid $brand-color;
      font-size: .75rem;
      text-align: center;

      a {
        color: $brand-color;
      }
    }
  }
</style>
