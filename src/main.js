// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import "iview/dist/styles/iview.css"
import {Button, Input, Icon, Message} from "iview"

Vue.config.productionTip = false;

Vue.component("Button", Button);
Vue.component("Input", Input);
Vue.component("Icon", Icon);
Vue.prototype.$Message = Message;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
