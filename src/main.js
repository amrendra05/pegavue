import Vue from "vue";
import ElementUI from "element-ui";
import locale from 'element-ui/lib/locale/lang/en'
import { sync } from 'vuex-router-sync';

import App from "./App.vue";
import router from "./router";
import store from "./store";
import plugins from './plugins'

import './assets/styles/element/index.css'
import './assets/styles/main.scss'
import './assets/styles/uikit/pega-icons.css'

Vue.use(ElementUI, { locale });
Vue.use(plugins)
sync(store, router, { moduleName: 'route' })

Vue.config.productionTip = false;
Vue.config.devtools = true

new Vue({
  name: 'root',
  router,
  store,
  render: h => h(App)
}).$mount("#app");
